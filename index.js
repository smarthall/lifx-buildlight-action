const https = require('https');
const querystring = require('querystring');
const core = require('@actions/core');

const validStatus = [
    "in_progress",
    "failure",
    "success",
    "cancelled",
]

const options = {
    hostname: 'api.lifx.com',
    port: 443,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

const postData = {}

try {
    const token = core.getInput('lifx-token');
    const selector = core.getInput('selector');
    const status = core.getInput('status');

    if (!validStatus.includes(status)) {
        throw "Status was not valid";
    }

    switch (status) {
        case 'in_progress':
            options.method = 'POST';
            options.path = '/v1/lights/' + selector + '/effects/breathe';

            postData.color = 'orange';
            postData.period = 4;
            postData.cycles = 99;
            postData.power_on = true;
            break;

        case 'failure':
            options.method = 'PUT';
            options.path = '/v1/lights/' + selector + '/state';

            postData.color = 'red';
            postData.power = 'on';
            postData.fast = true;
            break;

        case 'success':
            options.method = 'PUT';
            options.path = '/v1/lights/' + selector + '/state';
    
            postData.color = 'green';
            postData.power = 'on';
            postData.fast = true;
            break;

        case 'cancelled':
            options.method = 'PUT';
            options.path = '/v1/lights/' + selector + '/state';
    
            postData.color = 'orange';
            postData.power = 'on';
            postData.fast = true;
            break;
    }

    const strPostData = querystring.stringify(postData);
    options.headers['Content-Length'] = Buffer.byteLength(strPostData);
    options.headers['Authorization'] = 'Bearer ' + token;

    const req = https.request(options)
    req.write(strPostData)
    req.end()

} catch (error) {
    core.setFailed(error.message);
}
