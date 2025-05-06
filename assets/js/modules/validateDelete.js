// Validation avant suppréssion
const modal = document.getElementById('validateModal');
const buttonYes = document.getElementById('validateModalYes');
const closeButtons = document.querySelectorAll('[data-close-modal]');

export async function validateDelete() {

  let validatePromise = new Promise(async(resolve) => {
    
    buttonYes.addEventListener('click', function () {

      modal.setAttribute('hidden', '');
      resolve(true);
      
    });

    closeButtons.forEach(button => {
      button.addEventListener('click', function() {

        modal.setAttribute('hidden','');
        resolve(false);
      })
    });
  })

  return await validatePromise;
}

export {modal,buttonYes}