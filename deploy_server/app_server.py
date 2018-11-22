from flask import Flask, render_template, request
from flask_cors import CORS
from scipy.misc import imsave, imread, imresize
from tensorflow.python.keras.preprocessing import image
from tensorflow.python.keras.models import load_model, model_from_json
from tensorflow.python.keras.applications.xception import preprocess_input
from PIL import Image
import numpy as np
import re
import sys 
import os
import base64
from io import BytesIO

# Variables
loaded_model = None
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}} )

target_size = (224, 224)

classes_table = [
    'type1',
    'type2',
    'type3',
    'type4',
    'type5',
    'type6',
    'type7',
    'type8',
    'type9',
    'noise1',
    'noise2',
    'noise3'
     ]

def load_model_from_files(target_model_name):
    json_file = open(target_model_name + '.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    model = model_from_json(loaded_model_json)
    model.load_weights(target_model_name + ".h5")
    # model.compile(loss='categorical_crossentropy',optimizer='adam',metrics=['accuracy'])
    print('Model Loaded')
    return model


def convertImage(imgData1):
    imgstr = re.search(b'base64,(.*)',imgData1).group(1)
    with open('output.png','wb') as output:
        output.write(base64.b64decode(imgstr))


def decode64_image(srcImg):
    decoded_image = base64.b64decode(re.search(b'base64,(.*)', srcImg).group(1))
    return Image.open(BytesIO(decoded_image))


@app.route('/')
def index():
    #initModel()
    #render out pre-built HTML file right on the index page
    # return render_template("index.html")
    return "This is a server to provide prediction."


@app.route('/predict/',methods=['GET','POST'])
def predict():
    imgData = request.get_data()

    # convertImage(imgData)
    # img = Image.open('output.png')
    img = decode64_image(imgData)

    if img.size != target_size:
        img = img.resize(target_size)

    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    preds = loaded_model.predict(x)
    result = preds[0]
    print(result)
    response = classes_table[np.argmax(result)]
    return response


if __name__ == "__main__":
    loaded_model = load_model_from_files('xception_model')
    #decide what port to run the app in
    port = int(os.environ.get('PORT', 5000))
    #run the app locally on the givn port
    app.run(host='0.0.0.0', port=port)
    #optional if we want to run in debugging mode
    #app.run(debug=True)
