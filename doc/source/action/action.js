/**
  *
  * main() será executado quando você chamar essa ação
  *
  * @param As ações do Cloud Functions aceitam um único parâmetro, que deve ser um objeto JSON.
  *
  * @return A saída dessa ação, que deve ser um objeto JSON.
  *
  */
const request = require('request');
function main(params) {
    const getToken = () => {
        const options = {
            url: "https://us-south.ml.cloud.ibm.com/v3/identity/token",
            headers: {
                "Content-Type": "application/json"
            },
            auth: {
                // TODO: Substituir com USERNAME e PASSWORD do serviço de Watson Machine Learning
                user: "<Username_Watson_Machine_Learning>",
                pass: "<Password_Watson_Machine_Learning>"
            },
            json: true
        };
        return new Promise((resolve, reject) => {
            request.get(options, (error, resp, body) => {
                if (error) reject(error);
                else {
                    resolve(body.token);
                }
            });
        });
    };

    return new Promise((resolve, reject) => {
        const body = {
            fields: ["viagem", "bebida", "genero", "hobby"],
            values: [[params.viagem, params.bebida, params.genero, params.hobby]]
        };

        getToken().then(token => {
            const options = {
                // TODO: Substituir com SCORING END-POINT do Deployment do Modeler flow
                url: "<Scoring End-point_Modeler_Flow>",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: body,
                json: true
            };
            request.post(options, (error, resp, data) => {
                if (error) reject(error);
                else if (data.errors) {
                    resolve({
                        "err": true,
                        "produto": data.errors[0].message
                    });
                }
                else {
                    resolve({
                        "err": false,
                        "produto": data.values[0][0]
                    });
                }
            });
        }).catch(err => reject(err));
    });
}
