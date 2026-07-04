import { AuthService } from './auth.service';

describe('AuthService MFA primitives', () => {
  const service = new AuthService({} as any, {} as any, {} as any);

  it('generates the RFC 6238 six-digit TOTP value', () => {
    const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
    expect((service as any).totp(secret, 1)).toBe('287082');
  });

  it('encrypts and decrypts an MFA secret', () => {
    const previous = process.env.MFA_ENCRYPTION_KEY;
    process.env.MFA_ENCRYPTION_KEY = 'unit-test-mfa-encryption-key';
    const encrypted = (service as any).encrypt('JBSWY3DPEHPK3PXP');
    expect(encrypted).not.toContain('JBSWY3DPEHPK3PXP');
    expect((service as any).decrypt(encrypted)).toBe('JBSWY3DPEHPK3PXP');
    process.env.MFA_ENCRYPTION_KEY = previous;
  });
});
