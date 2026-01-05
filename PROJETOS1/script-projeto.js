// small UI helpers: mobile menu + simple contact form fake submit
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');

  // mobile toggle
  toggle.addEventListener('click', () => {
    const isHidden = nav.getAttribute('aria-hidden') === 'true' || !nav.getAttribute('aria-hidden');
    if(isHidden){
      nav.setAttribute('aria-hidden', 'false');
      nav.style.display = 'flex';
    } else {
      nav.setAttribute('aria-hidden', 'true');
      nav.style.display = '';
    }
  });

  // footer year
  const ano = document.getElementById('ano');
  if(ano) ano.textContent = new Date().getFullYear();

  // contact form: basic validation + fake submit
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMessage');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const mensagem = document.getElementById('mensagem').value.trim();

      if(!nome || !email || !mensagem){
        msg.textContent = 'Preencha todos os campos antes de enviar.';
        msg.style.color = '#f7b6b6';
        return;
      }

      // aqui você pode substituir por fetch() para backend real
      msg.textContent = 'Mensagem enviada! Nós te respondemos em breve.';
      msg.style.color = '#A6E3C6';
      form.reset();
    });
  }
});
