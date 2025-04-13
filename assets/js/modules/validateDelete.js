// Validation avant suppréssion
const modal = document.getElementById('validateModal');
const closeButton = document.getElementById('closeButton');
const buttonYes = document.getElementById('validateModalYes');
const buttonCancel = document.getElementById('validateModalNo');

export async function validateDelete() {

  let validatePromise = new Promise(async(resolve) => {
    
    buttonYes.addEventListener('click', function () {

      modal.setAttribute('hidden', '');
      resolve(true);
      
    });

    buttonCancel.addEventListener('click', function () {

      modal.setAttribute('hidden', '');
      resolve(false);
      
    });

    closeButton.addEventListener('click', function() {

      modal.setAttribute('hidden','');
      resolve(false);
      
    })

    
  })

  return await validatePromise;
}

export {modal,closeButton,buttonYes,buttonCancel}