from flask import Flask, request, jsonify
from linkedin_api import Linkedin 

# initializations
app = Flask(__name__)

api = Linkedin('JuradxPresentacion@outlook.es', 'Jurad@Presentacion123')

@app.route('/get-linkedin-data', methods=['POST'])
def get_linkedin_data():
    data = request.get_json()
    return jsonify(api.get_profile(public_id = data.get('publicId')))

# starting the app
if __name__ == "__main__":
    app.run(host='0.0.0.0', port = 3000, debug = True)
