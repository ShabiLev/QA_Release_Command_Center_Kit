#!/usr/bin/env python
"""Build a clean, sale-ready ZIP of the QA Release Command Center Kit.

Copies only the folders a buyer should receive, excludes VCS metadata, IDE
folders, logs, and anything that looks like a credential, then writes the
ZIP plus a build report to dist/.

Usage:
    python scripts/build_sale_zip.py
"""
import os
import re
import sys
import zipfile
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(ROOT, 'dist')
ZIP_NAME = 'QA_Release_Command_Center_Kit_SALE.zip'
ZIP_PATH = os.path.join(DIST_DIR, ZIP_NAME)
BUILD_REPORT_PATH = os.path.join(DIST_DIR, 'BUILD_REPORT.md')

SALE_FOLDERS = [
    '00_START_HERE', '01_PROJECT_DESCRIPTION', '02_COMMAND_CENTER', '03_DATA',
    '04_TEMPLATES', '05_AI_PROMPTS', '06_MARKETING', '07_EXPORT_EXAMPLES',
    '08_DOCS', '09_VERSIONING', '10_GUIDES_AND_EXPORTS',
]

EXCLUDE_DIR_NAMES = {'.git', '.github', 'node_modules', '.vscode', '.idea', '__pycache__', 'dist', '.pytest_cache'}
EXCLUDE_FILE_PATTERNS = [
    re.compile(r'\.log$', re.I),
    re.compile(r'^\.env'),
    re.compile(r'credentials', re.I),
    re.compile(r'secret', re.I),
    re.compile(r'\.tmp$', re.I),
    re.compile(r'^Thumbs\.db$', re.I),
    re.compile(r'^\.DS_Store$', re.I),
]
# Best-effort scan of text files for obvious secret shapes before they ever reach the ZIP.
# This is a safety net, not a substitute for not committing secrets in the first place.
SECRET_PATTERNS = [
    re.compile(r'api[_-]?key\s*[:=]\s*[\'"][A-Za-z0-9_\-]{10,}[\'"]', re.I),
    re.compile(r'(jira|atlassian)[_-]?(api[_-]?)?token\s*[:=]\s*[\'"][A-Za-z0-9_\-]{10,}[\'"]', re.I),
    re.compile(r'-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----'),
]
TEXT_EXTENSIONS = {'.md', '.json', '.js', '.html', '.css', '.csv', '.txt', '.py'}


def should_exclude_dir(name):
    return name in EXCLUDE_DIR_NAMES


def should_exclude_file(name):
    return any(p.search(name) for p in EXCLUDE_FILE_PATTERNS)


def scan_for_secrets(path):
    if os.path.splitext(path)[1].lower() not in TEXT_EXTENSIONS:
        return []
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except OSError:
        return []
    return [p.pattern for p in SECRET_PATTERNS if p.search(content)]


def collect_files():
    files = []
    warnings = []
    for folder in SALE_FOLDERS:
        folder_path = os.path.join(ROOT, folder)
        if not os.path.isdir(folder_path):
            warnings.append('Folder "{}" is listed as sale-relevant but does not exist locally — skipped.'.format(folder))
            continue
        for dirpath, dirnames, filenames in os.walk(folder_path):
            dirnames[:] = [d for d in dirnames if not should_exclude_dir(d)]
            for fname in filenames:
                if should_exclude_file(fname):
                    warnings.append('Excluded file: {}'.format(os.path.relpath(os.path.join(dirpath, fname), ROOT)))
                    continue
                full_path = os.path.join(dirpath, fname)
                arcname = os.path.relpath(full_path, ROOT)
                files.append((full_path, arcname))
    return files, warnings


def main():
    os.makedirs(DIST_DIR, exist_ok=True)
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)

    files, warnings = collect_files()

    secret_warnings = []
    for full_path, arcname in files:
        hits = scan_for_secrets(full_path)
        if hits:
            secret_warnings.append('Possible secret pattern in {}: {}'.format(arcname, hits))

    with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zf:
        for full_path, arcname in files:
            zf.write(full_path, arcname)

    with zipfile.ZipFile(ZIP_PATH, 'r') as zf:
        bad_file = zf.testzip()
        names = zf.namelist()
    zip_valid = bad_file is None
    git_in_zip = any(n == '.git' or n.startswith('.git/') for n in names)

    report_lines = [
        '# Sale ZIP Build Report',
        '',
        '- Build date: {}'.format(datetime.now().isoformat(timespec='seconds')),
        '- File count: {}'.format(len(files)),
        '- Zip path: {}'.format(os.path.relpath(ZIP_PATH, ROOT)),
        '- Included folders: {}'.format(', '.join(SALE_FOLDERS)),
        '- Excluded directory names: {}'.format(', '.join(sorted(EXCLUDE_DIR_NAMES))),
        '- Zip integrity: {}'.format('PASS' if zip_valid else 'FAIL ({})'.format(bad_file)),
        '- Contains .git: {}'.format('YES — FAIL' if git_in_zip else 'No — PASS'),
        '',
        '## Warnings',
    ]
    all_warnings = warnings + secret_warnings
    report_lines.extend(['- {}'.format(w) for w in all_warnings] if all_warnings else ['- None'])

    with open(BUILD_REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines) + '\n')

    print('\n'.join(report_lines))
    if not zip_valid or git_in_zip:
        sys.exit(1)


if __name__ == '__main__':
    main()
