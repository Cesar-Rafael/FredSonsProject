import { postData } from '/utils/fetch.js'

$(async () => {
    $('#search-profile').on('click', async () => {
        let publicUrl = $('#public-url').val()
        let response = await postData('/search-data', { publicUrl })
        console.log(response)
    })
});