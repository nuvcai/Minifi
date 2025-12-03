# Security Policy

## MiniFi™ Security Overview

MiniFi is a commercial financial education platform handling user data and investment simulations. We take security seriously and implement industry best practices to protect our users.

## Supported Versions

| Version | Supported | Security Updates |
|---------|-----------|------------------|
| 1.2.x   | ✅ Current | Active |
| 1.1.x   | ✅ LTS | Critical only |
| 1.0.x   | ⚠️ Limited | Critical only |
| < 1.0   | ❌ EOL | None |

## Security Features

### Authentication & Authorization
- Session-based authentication with secure tokens
- Email verification for account creation
- Rate limiting on authentication endpoints
- Secure password hashing (bcrypt)

### Data Protection
- All data encrypted in transit (TLS 1.3)
- Database encryption at rest (Supabase)
- PII minimization practices
- GDPR/Privacy Act compliance

### API Security
- API key authentication for backend services
- CORS restrictions
- Request validation and sanitization
- SQL injection prevention via parameterized queries

### Infrastructure
- Vercel edge network (DDoS protection)
- Render managed hosting (auto-updates)
- Environment variables for secrets
- No hardcoded credentials

## Reporting a Vulnerability

### 🔒 Responsible Disclosure

We appreciate the security research community's efforts in helping keep MiniFi safe.

**DO NOT** report security vulnerabilities through public GitHub/GitLab issues.

### How to Report

1. **Email**: security@nuvc.ai
2. **Subject**: `[SECURITY] Brief description`
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

| Timeline | Action |
|----------|--------|
| 24 hours | Acknowledgment of report |
| 72 hours | Initial assessment |
| 7 days | Status update |
| 30-90 days | Fix deployed (depending on severity) |

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| 🔴 Critical | Data breach, RCE, auth bypass | 24-48 hours |
| 🟠 High | Privilege escalation, XSS | 7 days |
| 🟡 Medium | Information disclosure | 14 days |
| 🟢 Low | Minor issues | 30 days |

### Bug Bounty

We currently do not have a formal bug bounty program. However, we recognize and appreciate security researchers who responsibly disclose vulnerabilities:

- Public acknowledgment (with permission)
- Letter of recognition
- Potential monetary reward for critical findings

## Security Best Practices for Users

### For Developers
- Never commit secrets to repository
- Use environment variables for all sensitive data
- Keep dependencies updated
- Review code for security issues before merging

### For Administrators
- Enable MFA on all accounts
- Rotate API keys every 90 days
- Monitor access logs regularly
- Keep deployment platforms updated

### For End Users
- Use strong, unique passwords
- Don't share account credentials
- Report suspicious activity immediately

## Compliance

MiniFi is designed to comply with:

| Regulation | Status |
|------------|--------|
| Australian Privacy Act 1988 | ✅ Compliant |
| GDPR (EU) | ✅ Compliant |
| CCPA (California) | ✅ Compliant |
| SOC 2 Type II | 🔄 In progress |

## Third-Party Security

### Dependencies
We regularly audit and update dependencies using:
- `npm audit` for frontend
- `pip-audit` for backend
- Dependabot/Renovate for automated updates

### Third-Party Services

| Service | Security Certification |
|---------|----------------------|
| Vercel | SOC 2 Type II |
| Render | SOC 2 Type II |
| Supabase | SOC 2 Type II |
| OpenAI | SOC 2 Type II |

## Incident Response

In case of a security incident:

1. **Identify** - Detect and assess the incident
2. **Contain** - Limit the damage and prevent spread
3. **Eradicate** - Remove the threat
4. **Recover** - Restore normal operations
5. **Learn** - Post-incident review and improvements

### Contact for Incidents

- **Security Team**: security@nuvc.ai
- **Emergency**: +61 (contact available to licensees)

## Security Updates

Subscribe to security updates:
- GitLab releases: Watch the repository
- Email: Subscribe at nuvc.ai/security

---

## Legal

This security policy is part of the MiniFi™ Commercial Proprietary License.

Unauthorized security testing without written permission may violate:
- Computer Fraud and Abuse Act
- Australian Criminal Code Act 1995
- Terms of Service

Always obtain written authorization before conducting security research.

---

*Last Updated: December 2025*
*NUVC.AI Pty Ltd © 2024-2025. All Rights Reserved.*
