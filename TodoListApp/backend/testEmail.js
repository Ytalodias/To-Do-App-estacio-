import { sendEmail } from './models/emailService.js';

(async () => {
  try {
    await sendEmail(
      'ytalod47@gmail.com',
      'Teste de Email',
      'Se você recebeu este email, o envio funcionou!',
      '<h1>Envio local funcionando!</h1>'
    );
  } catch (err) {
    console.error(err);
  }
})();
