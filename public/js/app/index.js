import { postData } from '/utils/fetch.js'
import { showNotification } from '/utils/showNotification.js'

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

        let response = await postData('/search-person-information', { publicUrl })
        console.log(response)
    })

    $('#start-searching').on('click', () => {
        $('#public-url').focus()
        $('#public-url').addClass('is-valid')
        setTimeout(() => {
            $('#public-url').removeClass('is-valid')
        }, 1500)
    })
});