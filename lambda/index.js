/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
"use strict";
const Alexa = require('ask-sdk-core');
const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const mysql = require('mysql');
const grafanaBaseUrl = 'http://172.22.2.125:3000';
const dashboardUid = 'b02a5d2a-3a95-40f3-b27a-1cbee530d0b8';
const DOCUMENT_ID = "artiscaWeb";


//-------------------------- INICIO SIN CONEXIÓN --------------------------------------------

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hola paisano, que necesitas?';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//------------------------ INICIO --- CONEXIÓN A LA BD DE MYSQL (DATOS SENSORES) ----------------------------

/*const databaseModule = require('./database.js');
var connection;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        try {
             connection = await databaseModule.dbConnection();
            
            if (connection.state === 'authenticated') {
                return handlerInput.responseBuilder
                    .speak('Conexión establecida. ¿Qué necesitas?')
                    .reprompt('Conexión establecida. ¿Qué necesitas?')
                    .getResponse();
            } else {
                return handlerInput.responseBuilder
                    .speak('Conexión fallida: ' + connection.state)
                    .reprompt('Conexión fallida: ' + connection.state)
                    .getResponse();
            }
        } catch (error) {
            return handlerInput.responseBuilder
                .speak('Ocurrió un error al conectar con la base de datos.') //AL PROBAR, DA ESTE ERROR.
                .getResponse();
        }
    }
};
*/

//---------------------------- APL TEMPERATURA ACTUAL (CON BASE DE DATOS)--------------------------------------- (NO SE HA PROBADO EL MÉTODO PORQUE NO SE HA PODIDO CONECTAR A LA BD)

/*const ObtenerTemperaturaIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ObtenerTemperaturaIntent';
  },
  async handle(handlerInput) {
    try {
        let speechOutput = "";
        const queryTemperatura = 'SELECT * FROM temperatura ORDER BY fecha DESC LIMIT 1';
        connection.query(queryTemperatura, function (err, result, fields){
            if(err){
                speechOutput = "Error al obtener los datos" 
                return;
            }else{
                const temperatura = result[0].temp;
                //const temperatura = '25ªC';
                // Verificar si el dispositivo es compatible con APL
                const supportsAPL = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL'];

                speechOutput += `La última temperatura registrada es de ${temperatura}.`;

                if (supportsAPL) {
                    // Construir APL para temperatura
                    const aplTemperaturaDocument = {
                        type: 'APL',
                        version: '2023.1',
                        background: '#FFAE75',
                        mainTemplate: {
                            items: [
                                {
                                type: 'Container',
                                direction: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100vh',
                                items: [
                                    {
                                    type: 'Text',
                                    text: 'El último registro de temperatura detectado es de: ' + temperatura,
                                    fontSize: '50px',
                                    color: 'black',
                                    textAlign: 'center',
                                    width: '100%',
                                    fontFamily: 'Times New Roman',
                                    },
                                ],
                                },
                            ],
                        },
                    };
                    // Agregar APL para temperatura
                    handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: 'temperaturaToken',
                    document: aplTemperaturaDocument,
                    });
                   
                    speechOutput += ' Puedes ver la información en la pantalla.';
                }

            }
        });
      
     return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();
    } catch (error) {
      console.error(error);
      return handlerInput.responseBuilder
        .speak(error.message)
        .getResponse();
    }
  }
};*/

//---------------------------- APL HUMEDAD ACTUAL (CON BASE DE DATOS)--------------------------------------- (NO SE HA PROBADO EL MÉTODO PORQUE NO SE HA PODIDO CONECTAR A LA BD)

/*const ObtenerHumedadIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ObtenerHumedadIntent';
  },
  async handle(handlerInput) {
    try {
        let speechOutput = "";
        const queryHumedad = 'SELECT * FROM humedad ORDER BY fecha DESC LIMIT 1';
        connection.query(queryHumedad, function (err, result, fields){
            if(err){
                speechOutput = "Error al obtener los datos" 
                return;
            }else{
                const humedad = result[0].porcentaje;
                //const humedad = '43%';
                // Verificar si el dispositivo es compatible con APL
                const supportsAPL = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL'];

                speechOutput += `La última humedad registrada es del ${humedad}.`;

                if (supportsAPL) {
                    // Construir APL para humedad
                    const aplTemperaturaDocument = {
                        type: 'APL',
                        version: '2023.1',
                        background: '#BDF0FC',
                        mainTemplate: {
                            items: [
                                {
                                type: 'Container',
                                direction: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100vh',
                                items: [
                                    {
                                        type: 'Text',
                                        text: 'El último registro de humedad detectado es del: ' + humedad,
                                        fontSize: '50px',
                                        color: 'black',
                                        textAlign: 'center',
                                        width: '100%',
                                        fontFamily: 'Times New Roman',
                                    },
                                ],
                                },
                            ],
                        },
                    };
                    // Agregar APL para humedad
                    handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: 'humedadToken',
                    document: aplHumedadDocument,
                    });
                    
                    speechOutput += ' Puedes ver la información en la pantalla.';
                }

            }
        });
      
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    } catch (error) {
      console.error(error);
      return handlerInput.responseBuilder
        .speak(error.message)
        .getResponse();
    }
  }
};*/

//---------------------------- APL TEMPERATURA ACTUAL (CON DATO DE PRUEBA)---------------------------------------

const ObtenerTemperaturaIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ObtenerTemperaturaIntent';
  },
  async handle(handlerInput) {
    try {
        const temperatura = "25ºC" 
    
        // Verificar si el dispositivo es compatible con APL
        const supportsAPL = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL'];
    
        let speechOutput = `El último registro de temperatura detectado es del ${temperatura}.`;
    
        if (supportsAPL) {
            // Construir APL para temperatura
            const aplTemperaturaDocument = {
                type: 'APL',
                version: '2023.1',
                background: '#FFAE75',
                mainTemplate: {
                    items: [
                        {
                            type: 'Container',
                            direction: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100vh',
                            items: [
                                {
                                    type: 'Text',
                                    text: 'El último registro de temperatura detectado es de: ' + temperatura,
                                    fontSize: '50px',
                                    color: 'black',
                                    textAlign: 'center',
                                    width: '100%',
                                    fontFamily: 'Times New Roman',
                                },
                            ],
                        },
                    ],
                },
            };
            // Agregar APL para temperatura
            handlerInput.responseBuilder.addDirective({
              type: 'Alexa.Presentation.APL.RenderDocument',
              token: 'temperaturaToken',
              document: aplTemperaturaDocument,
            });
        
            speechOutput += 'Puedes ver la información en la pantalla.';
        }
    
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    } catch (error) {
      console.error(error);
      return handlerInput.responseBuilder
        .speak(error.message)
        .getResponse();
    }
  }
};

//-------------------------------APL HUMEDAD ACTUAL (CON DATO DE PRUEBA)-----------------------------------

const ObtenerHumedadIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ObtenerHumedadIntent';
  },
  async handle(handlerInput) {
    try {
      const humedad = "43%" 

      // Verificar si el dispositivo es compatible con APL
      const supportsAPL = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL'];

      let speechOutput = `El último registro de humedad detectado es del ${humedad} por ciento.`;

      if (supportsAPL) {
        // Construir APL para humedad
        const aplHumedadDocument = {
           type: 'APL',
            version: '2023.1',
            background: '#BDF0FC',
            mainTemplate: {
                items: [
                    {
                        type: 'Container',
                        direction: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        items: [
                            {
                                type: 'Text',
                                text: 'El último registro de humedad detectado es del: ' + humedad,
                                fontSize: '50px',
                                color: 'black',
                                textAlign: 'center',
                                width: '100%',
                                fontFamily: 'Times New Roman',
                            },
                        ],
                    },
                ],
            },
        };

        // Agregar APL para humedad
        handlerInput.responseBuilder.addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          token: 'humedadToken',
          document: aplHumedadDocument,
        });

        speechOutput += 'Puedes ver la información en la pantalla.';
      }

      return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();
    } catch (error) {
      console.error(error);
      return handlerInput.responseBuilder
        .speak(error.message)
        .getResponse();
    }
  }
};

//--------------------CONEXIÓN A LA BD DE POSTGRESQL (BASE DE DATOS DE GRAFANA)-----------------------  (NO DA ERROR PERO NO CONECTA A LA BASE DE DATOS) 

/*const { Client } = require('pg');
const connection = {
  user: 'grafana_user',
    host: '172.22.2.125',
    database: 'grafana',
    password: 'grafana',
    port: '5432',
};

const client = new Client(connection);

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        var speakOutput = 'Hola paisano, que necesitas?';
        
        //client.connect();  DA ERROR EN LA RESPUESTA DE LA SKILL
        
        client.on('error', function (err, client) {
             speakOutput = "Hola paisano, no se ha podido establecer conexión";
                return;
        });
            speakOutput = "Hola paisano, conexión a la bd establecida, que necesitas?"

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};*/


//--------------------------- ABRIR GRAFANA PASANDO URL CÓMO PARÁMETRO   (FORMA 1)-----------------------------  (NO FUNCIONA)

/*const createDirectivePayload = (aplDocumentId, url, tokenId = "documentToken") => {
    const dataSources = {
        data: {
            type: 'object',
            properties: {
                source: url
            }
        }
    };

   // const parameters = {
     //   sourceParam: "${data.properties.source}"
//    };

    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId,
            datasources: dataSources,
          //  parameters: parameters
        }
    };
};

const AbrirGrafanaRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'abrirGrafanaIntent';
    },
    handle(handlerInput) {
        const urlCompleta = "http://artisca.com";

        const aplDirective = createDirectivePayload(DOCUMENT_ID, urlCompleta);

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder.getResponse();
    }
};

//--------------------------- ABRIR GRAFANA PASANDO URL CÓMO PARÁMETRO  (FORMA 2)----------------------------- (NO FUNCIONA)

/*const urlCompleta = "http://artisca.com";//"http://172.22.2.125:3000/d/b02a5d2a-3a95-40f3-b27a-1cbee530d0b8/ejemplo?orgId=1";

const AbrirGrafanaRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'abrirGrafanaIntent';
    },
    handle(handlerInput) {

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            
            const aplDirective = {
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: 'documentToken',
                document: {
                    type:"Link",
                    src: "doc://alexa/apl/documents/" + DOCUMENT_ID,
                    datasources: {
                        data: {
                            type: 'object',
                            properties: {
                                source: urlCompleta
                            }
                        }
                    }
                }
            };

            // se añade al responseBuilder.
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        // send out skill response
        return handlerInput.responseBuilder.getResponse();
    }
};*/

//-------------------------------ABRIR GRAFANA DESDE EL APL --------------------------------

const AbrirGrafanaRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'abrirGrafanaIntent';
    },
    handle(handlerInput) {
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // Se genera el APL que se abrira en el navegador.
            const aplDirective = createDirectivePayload(DOCUMENT_ID);
            // se añade al responseBuilder.
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        // send out skill response
        return handlerInput.responseBuilder.getResponse();
    }
};

//--------------------------------ABRIR GRAFANA CON API-------------------------------------  (NO FUNCIONA)

const openDashboardGrafana = async () => {
  try {
    // Obtén el token de autenticación de Grafana
    const apiKey = fs.readFileSync('ApiKey.txt', 'utf8').trim();

    // Crea una solicitud a la API de Grafana para obtener la URL del dashboard
    const response = await axios.get(`${grafanaBaseUrl}/api/dashboards/uid/${dashboardUid}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    // Concatena la URL base con la URL relativa del dashboard
    const dashboardUrl = `${grafanaBaseUrl}${response.data.meta.url}`;
    console.log(`URL del dashboard de Grafana: ${dashboardUrl}`);

    // Abre la URL del dashboard en el navegador (Google Chrome) usando 'child_process'
    exec(`start ${dashboardUrl}`, (error) => {
      if (error) {
        console.error('Error al abrir el dashboard de Grafana en el navegador:', error);
      } else {
        console.log('Dashboard de Grafana abierto en el navegador');
      }
    });
  } catch (error) {
    console.error('Error al abrir el dashboard de Grafana:', error);
  }
};

const OpenGrafanaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OpenGrafanaIntent';
    },
    handle(handlerInput) {
        // Llama a la función para abrir Grafana
        openDashboardGrafana();

        const speakOutput = 'Abriendo grafana.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//-------------------------------------HELP INTENT HANDLER -------------------------------------

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Con que necesitas ayuda?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//-------------------------------------CANCEL AND STOP INTENT HANDLER -------------------------------------

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

//-------------------------------------FALLBACK INTENT HANDLER -------------------------------------

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Perdon, me lo puedes repetir';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//-------------------------------------SESSION ENDED REQUEST HANDLER -------------------------------------

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

//-------------------------------------INTENT REFLECTOR HANDLER -------------------------------------

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `acabas de ejecutar ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

//-------------------------------------ERROR HANDLER -------------------------------------

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Tenemos problemas tecnicos,prueba otra vez por favor.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//--------------------------------OBTENER DIRECCIÓN APL --------------------------------

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        }
    }
};

//-------------------------------------EXPORTS HANDLER -------------------------------------

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ObtenerTemperaturaIntentHandler,
        ObtenerHumedadIntentHandler,
        AbrirGrafanaRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
        OpenGrafanaIntentHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();