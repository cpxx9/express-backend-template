const { genPassword, validPassword } = require('../utils/passwordUtils');

describe('passwordUtils', () => {
  test('genPassword and validPassword work to validate correct password', () => {
    const { salt, hash } = genPassword('secret');
    expect(validPassword('secret', hash, salt)).toBe(true);
  });

  test('genPassword and validPassword work to validate incorrect password', () => {
    const { salt, hash } = genPassword('secret');
    expect(validPassword('wrong', hash, salt)).toBe(false);
  });
});
