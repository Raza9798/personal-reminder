const express = require('express');
const moment = require('moment');
const app = express();
const port = 3030;
const cors = require('cors');
const formidable = require('express-formidable');
const notifier = require('node-notifier');

app.use(formidable({
    encoding: 'utf-8',
    uploadDir: '/storage',
    multiples: true
}));
app.use(cors());

const notificationArr = [];
const notificationIntervals = {};

const notify = () => {
    notificationArr.forEach(element => {
        if (!notificationIntervals[element.title]) {
            const intervalId = setInterval(() => {
                console.log('Reminder', {
                    title: element.title,
                    duration: element.duration,
                    time: moment().format('hh:mm:ss A')
                });

                let message = `${element.title} - ${moment().format('hh:mm:ss A')}`;
                notifier.notify({
                    title: 'Reminder',
                    message: message,
                    sound: true,
                    wait: true,
                    actions: ['Done', 'Cancel']
                }, (err, response, metadata) => {
                    if (err) {
                        console.error('Notification error:', err);
                    } else {
                        if (response === 'activate' && metadata.activationValue === 'Done') {
                            clearInterval(intervalId);
                            delete notificationIntervals[element.title];
                            const index = notificationArr.findIndex(n => n.title === element.title);
                            if (index > -1) {
                                notificationArr.splice(index, 1);
                            }
                        }
                    }
                });
            }, moment.duration(element.duration).asMilliseconds());

            notificationIntervals[element.title] = intervalId;
        }
    });
};

app.get('/', (req, res) => {
    const { enable, title, duration } = req.query;

    if (enable === 'true') {
        if (!notificationArr.some(n => n.title === title)) {
            notificationArr.push({ title, duration });
        }
        notify();
    } else {
        const index = notificationArr.findIndex(n => n.title === title);
        if (index > -1) {
            clearInterval(notificationIntervals[title]);
            delete notificationIntervals[title];
            notificationArr.splice(index, 1);
        }
    }

    if (notificationArr.length === 0) {
        console.log('NO NOTIFICATIONS ON QUEUE');
    } else {
        console.log('NOTIFICATION LIST UPDATE =>', notificationArr);
    }
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log('REMINDER SERVICE STARTED');
});
