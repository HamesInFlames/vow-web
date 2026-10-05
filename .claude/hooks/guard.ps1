# .claude/hooks/guard.ps1  -- PreToolUse guard (matcher "Bash|PowerShell|Edit|Write"). Exit 2 = block.
$ProgressPreference = 'SilentlyContinue'
$raw = [Console]::In.ReadToEnd()
try { $in = $raw | ConvertFrom-Json } catch { exit 0 }
$tool = [string]$in.tool_name
$block = $null

if ($tool -eq 'Bash' -or $tool -eq 'PowerShell') {
  $cmd = [string]$in.tool_input.command
  $branch = ''
  try { $branch = [string](& git -C ([string]$in.cwd) rev-parse --abbrev-ref HEAD 2>$null) } catch { }
  if ($cmd -match '(?i)\bgit\b[^\r\n;|&]*\bpush\b') {
    if     ($cmd -match '(?i)(^|\s)(-f|--force\S*|--delete|-d|--mirror|--prune)(\s|=|$)') { $block = 'force or delete push' }
    elseif ($cmd -match '(?i)\s\+\S|\s:\S')                                               { $block = 'force or delete refspec' }
    elseif ($cmd -match '(?i)(\s|:|\+|refs/heads/)(main|master)(\s|$)')                    { $block = 'push to main/master' }
    elseif ($branch.Trim() -match '^(main|master)$')                                       { $block = 'push while checked out on main/master' }
  }
  if (-not $block -and $cmd -match '(?i)\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r|--recursive)|Remove-Item\b.*-Recurse|\b(rmdir|rd)\s+/s|\bdel\s+/s') { $block = 'recursive delete' }
  if (-not $block -and $cmd -match '(?i)\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f|branch\s+-D)|\bgh\s+repo\s+delete') { $block = 'destructive git/gh command' }
  if (-not $block -and $cmd -match '(?i)(^|[\s''"/\x5C])\.env(?!\.(example|sample|template))(\.\w+)?(?=$|[\s''"])') { $block = 'touches .env' }
}
elseif ($tool -eq 'Edit' -or $tool -eq 'Write') {
  $p = ([string]$in.tool_input.file_path).Replace([string][char]92, '/')
  if     ($p -match '(?i)(^|/)\.env(\.[^/]*)?$' -and $p -notmatch '(?i)\.env\.(example|sample|template)$') { $block = 'edit of .env' }
  elseif ($p -match '(?i)/\.claude/(settings(\.local)?\.json|hooks/)')                                     { $block = 'edit of guardrail config' }
  elseif ($p -match '(?i)/\.git/')                                                                         { $block = 'edit inside .git' }
}

if ($block) {
  [Console]::Error.WriteLine("Blocked by project guard hook: $block. Use a pull request / ask the developer.")
  exit 2
}
exit 0
