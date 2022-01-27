/**
 *
 * cc Maximilian Müller
 * @class Pagevisit
 */
class Pagevisit {
    /**
     * Creates an instance of Pagevisit.
     * @param {*} ipString
     * @memberof Pagevisit
     */
    constructor(ipString) {
        this.ip = ipString;
        this.newVisitor = this.validateSessionUser();
        this.mouseX = 0;
        this.mouseY = 0;
    }

    validateSessionUser() {
        if (sessionStorage.getItem("newVisitor")) {
            if (Boolean(sessionStorage.getItem("newVisitor")) === true)
                sessionStorage.setItem("newVisitor", false);

            sessionStorage.setItem("returningVisitor", true)
            this.returningVisitor = true;
            return false;
        } else {
            sessionStorage.setItem("newVisitor", true)
            sessionStorage.setItem("returningVisitor", false)
            this.returningVisitor = false;
            return true;
        }
    }

    set xcoordinate(x) {
        this.mouseX = x;
    }

    set ycoordinate(y) {
        this.mouseY = y;
    }
}

class Interface extends Pagevisit {
    constructor(
        ipString, timerUpdate, carrier, continent_name, country_name, city, postal, region, scroll) {
        super(ipString, timerUpdate, carrier, continent_name, country_name, city, postal, region, scroll);
    }

    update() {
        const display_newVisitor = $('#display_newvisitor'),
            display_returningVisitor = $('#display_returningvisitor'),
            display_ip = $('#display_ip'),
            display_mousex = $('#display_mousex'),
            display_mousey = $('#display_mousey'),
            display_carrier = $('#display_carrier'),
            display_continent_name = $('#display_continent_name'),
            display_country_name = $('#display_country_name'),
            display_city = $('#display_city'),
            display_postal = $('#display_postal'),
            display_region = $('#display_region'),
            display_scroll = $('#display_scroll');

        display_carrier.text(this.carrier);
        display_continent_name.text(this.continent_name);
        display_country_name.text(this.country_name);
        display_city.text(this.city);
        display_postal.text(this.postal);
        display_region.text(this.region);
        display_newVisitor.text(this.newVisitor);
        display_returningVisitor.text(this.returningVisitor);
        display_ip.text(this.ip);
        display_mousex.text(this.mouseX)
        display_mousey.text(this.mouseY)
        display_scroll.text(this.scroll)
    }
}

async function ipfiy() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response;
    } catch (error) {
        console.error(error);
        alert('Error: ' + error)
    }
}

(function () {
    (async () => {
        const ipfiyJson = await ipfiy();
        const ipv4 = ipfiyJson.data.ip;
        const apiKey = 'c78d4f2c8c84cbdf91e914a513acb735a7148723d9483bbbb757d3fb'; // ipData

        let interface = new Interface(ipv4, 4);
        interface.update();

        const ipdata = (apiKey) => {
            let request = new XMLHttpRequest();
            let response = null;
            request.open('GET', 'https://api.ipdata.co/?api-key=' + apiKey + '');
            request.setRequestHeader('Accept', 'application/json');
            request.onreadystatechange = function () {
                if (this.readyState === 4) {
                    console.log(this.responseText);
                    response = JSON.parse(this.responseText)
                    interface.carrier = response.carrier.name;
                    interface.continent_name = response.continent_name
                    interface.country_name = response.country_name
                    interface.city = response.city
                    interface.postal = response.postal
                    interface.region = response.region
                    interface.update();
                }
            };
            request.send();
        }
        const startup = () => {
            let old = console.log;
            let logger = document.getElementById('log');
            console.log = function (message) {
                if (typeof message == 'object') {
                    logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
                } else {
                    logger.innerHTML += message + '<br />';
                }
            }
        };

        window.track = {
            mousemovement: function (corx, cory) {
                console.log('mouse movement by:', corx, cory);
            }
        }

        window.addEventListener('message', function (e) {
            // Get the sent data
            let data = e.data;
            data = JSON.parse(data);

            interface.xcoordinate = data.xcoordinate;
            interface.ycoordinate = data.ycoordinate;
            interface.scroll = data.scrollmove;
            interface.update();

        });

        // ! lunch
        startup();
        ipdata(apiKey);
    })();
})();