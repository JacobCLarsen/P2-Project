export function createRsaUtils(JSEncrypt) {
  const encryptor = new JSEncrypt();
  const publicKey =
    "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7wW0P2ch7t4dPBnmEkVzPkjO+okYFzPEhX9lqxW9hRvdJ22ceH1sF9+uJdVYMId3ZG70V0lD2A27mUJ/Z0eSmG0OvcRydq9oJd7aUOwiqUOdSKsQtIX1pI5AF7jqcpY4WFXSnbTgGV4cHRi9yhm5jxuCwFVnKO4lfWlneTxjl+N2DrUP6Evj2Tg0iD2kA8wHYObfnGIf47Txk6A5AVh2yUAtnW5EwVGpkvAlYySHYEMym+Fc3xlFgTLErKTrtbn99VhZyQ0KLXNOpxSOfDTwQ9PESyqJ0bO2v3rTw1u0wYwhcfmuS+kbLFALApO9IklQFu2wM0lYO8prwCpCm7bfIQIDAQAB-----END PUBLIC KEY-----";
  encryptor.setPublicKey(publicKey);

  return { encryptor };
}
