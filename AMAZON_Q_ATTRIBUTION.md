# Amazon Q Developer Attribution Guide

## How to Show Amazon Q in GitLab Commits

### Method 1: Co-authored-by in Commit Message (Recommended)

```bash
git commit -m "feat: your feature description

Your detailed commit message here.

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

**Result**: Shows Amazon Q as a co-author in GitLab commit view.

### Method 2: Add to Commit Body

```bash
git commit -m "feat: add new feature

Implemented with assistance from Amazon Q Developer.

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

### Method 3: Use Git Trailer

```bash
git commit -m "feat: add feature" \
  --trailer "Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

## Quick Commands

### Single Commit with Q Attribution

```bash
git add .
git commit -m "feat: your feature

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
git push origin main
```

### Amend Last Commit (if not pushed)

```bash
git commit --amend -m "feat: your feature

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
git push origin main
```

### Add Q Attribution to Multiple Commits

```bash
# Interactive rebase
git rebase -i HEAD~3

# For each commit, change 'pick' to 'reword'
# Then add Co-authored-by line to each commit message
```

## GitLab Display

### What You'll See:

**Commit View:**
```
feat: add AWS Bedrock integration

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>
```

**Contributors View:**
- Your Name (Author)
- Amazon Q Developer (Co-author)

**Commit Graph:**
Shows both you and Amazon Q as contributors.

## Best Practices

### 1. Always Include for Q-Assisted Code

```bash
git commit -m "feat: implement AI coaching system

Built with Amazon Q Developer assistance for:
- Code generation
- Bug fixes
- Documentation
- Architecture suggestions

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

### 2. Be Specific About Q's Role

```bash
git commit -m "fix: resolve mobile UX issues

Amazon Q Developer helped identify and fix:
- Touch target sizing
- Responsive layout bugs
- CSS optimization

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

### 3. Use in Documentation Commits

```bash
git commit -m "docs: add comprehensive setup guide

Documentation created with Amazon Q Developer.

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

## Template for Future Commits

```bash
#!/bin/bash
# save as: commit_with_q.sh

MESSAGE="$1"

git commit -m "$MESSAGE

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

Usage:
```bash
chmod +x commit_with_q.sh
./commit_with_q.sh "feat: add new feature"
```

## Git Config Shortcut

Add to `.git/config` or `~/.gitconfig`:

```ini
[alias]
    qcommit = "!f() { git commit -m \"$1\n\nCo-authored-by: Amazon Q Developer <no-reply@amazon.com>\"; }; f"
```

Usage:
```bash
git qcommit "feat: add feature"
```

## Verification

Check if attribution is included:

```bash
# View last commit
git log -1 --pretty=full

# Should show:
# Author: Your Name <your@email.com>
# Co-authored-by: Amazon Q Developer <no-reply@amazon.com>
```

## GitLab Project Settings

### Enable Co-author Display

1. Go to Project Settings → General
2. Expand "Visibility, project features, permissions"
3. Ensure "Show co-authors" is enabled

### View Contributors

1. Go to Repository → Contributors
2. You'll see:
   - Your commits
   - Amazon Q Developer co-authored commits

## Example Commits

### Feature Addition
```bash
git commit -m "feat: add AWS Bedrock integration

- Implemented BedrockService for Claude models
- Added cost-effective AI provider option
- Supports Australian data residency

Developed with Amazon Q Developer assistance.

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

### Bug Fix
```bash
git commit -m "fix: resolve mobile touch target issues

- Increased button sizes to 44x44px
- Fixed responsive layout bugs
- Improved accessibility

Fixed with Amazon Q Developer guidance.

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

### Documentation
```bash
git commit -m "docs: add comprehensive API documentation

Complete API documentation including:
- Endpoint descriptions
- Request/response examples
- Error handling guide

Created with Amazon Q Developer.

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

## Benefits

✅ **Transparency**: Shows AI assistance in development
✅ **Recognition**: Credits Amazon Q Developer
✅ **Tracking**: Easy to see Q-assisted commits
✅ **Professional**: Demonstrates modern development practices
✅ **Compliance**: Meets attribution requirements

## Notes

- Co-author attribution is a Git standard (not GitLab-specific)
- Works on GitHub, GitLab, Bitbucket, etc.
- Does not affect commit authorship
- You remain the primary author
- Amazon Q is listed as co-author

## Summary

**Quick Command:**
```bash
git commit -m "your message

Co-authored-by: Amazon Q Developer <no-reply@amazon.com>"
```

**That's it!** Amazon Q will now appear in your GitLab commits. 🚀
