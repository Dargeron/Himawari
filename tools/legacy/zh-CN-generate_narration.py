#!/usr/bin/env python3
"""Mandarin edition: reuse cached complete clips and repair missing clips only."""
from repair_chinese_narration import main
if __name__=='__main__':
 import sys
 if '--single' not in sys.argv:sys.argv.append('--single')
 main()
