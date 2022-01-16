import { postData } from '/utils/fetch.js'
import { showNotification } from '/utils/showNotification.js'

let data = undefined

const getInformation = async () => {
  $('body').css('background-color', '#00629C')
  $('#main-panel').hide()
  $('#loader').show()
  $('#loader-data').modal('show')
  let response = await postData('/search-person-information', { publicId })
  if (response.result === 'OK') {
    data = response.content
    console.log(data)
    $('#loader-data').modal('hide')
    $('body').css('background-color', '')
    $('#main-panel').show()
    $('#loader').hide()
  } else {
    console.log('Algo salió mal')
  }
}

const loadInformation = () => {
  if (data) {
    $('#name-user').html(data.linkedin.name.toUpperCase())
    $('.headline-user').html(data.linkedin.headline)
    $('#location-user').html(`${data.linkedin.countryName} (${data.linkedin.location.basicLocation.countryCode.toUpperCase()})`)
    if (data.google.inline_images !== undefined) {
      $('#photo-user').attr('src', data.google.inline_images[0].thumbnail)
    }

  }
}

$(async () => {
  $('#search-profile').on('click', async () => {
    let publicUrl = $('#public-url').val()
    if (publicUrl === '') {
      showNotification('danger', 'URL Vacío', 'Necesita ingresar un URL de Linkedin', 'fas fa-times')
      $('#public-url').addClass('is-invalid')
      setTimeout(() => {
        $('#public-url').removeClass('is-invalid')
      }, 1500)
      return;
    }

    let publicId = publicUrl.split('/')[4] // Get the publicId which is the linkedin publicUrl last part 
    window.location.replace(`/profile?publicId=${publicId}`)
  })
  await getInformation()
  loadInformation()
});