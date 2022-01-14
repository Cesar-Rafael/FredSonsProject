from linkedin_api import Linkedin 


api = Linkedin('JuradoPresentacion123@outlook.es', 'Jurad@Presentacion1')
#print(api.get_profile('Cesar%20David'))
#print(api.get_profile('ACoAAC6G7PIBXIXrkvAshUjB9oF5FBNPll2Mso0'))


# https://www.linkedin.com/in/cesar-david-rafael-artica-a6a504199/
#print(api.search_people('cesar-david'))

print(api.get_profile(public_id = 'cesar-david-rafael-artica-a6a504199'))
