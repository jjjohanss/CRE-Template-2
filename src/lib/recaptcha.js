// Runs `render` as soon as Google reCAPTCHA is ready: right away if it has already
// loaded, otherwise when index.html's onRecaptchaLoad fires. Several forms can wait
// at once (they no longer overwrite each other). Returns a function that cancels.
export function whenRecaptchaReady(render) {
  if (window.__recaptchaReady && window.grecaptcha?.render) {
    render();
    return () => {};
  }
  window.__recaptchaQueue = window.__recaptchaQueue || [];
  window.__recaptchaQueue.push(render);
  return () => {
    const q = window.__recaptchaQueue || [];
    const i = q.indexOf(render);
    if (i !== -1) q.splice(i, 1);
  };
}
