import moment from "moment";

const finhubAPIKey = "clk8969r01qso7g5g2ngclk8969r01qso7g5g2o0";
const finhubAPISecret = "ckncuspr01qrbal936o0";

const duration = 2;
const getFinnhubApi = async (_url, _params) => {
    let params = { 'token': finhubAPIKey }
    params = { ...params, ..._params };
    try {
        let response = await fetch(_url + new URLSearchParams(params), {
            method: 'GET',      // headers: { "X-Finnhub-Secret": finhubAPISecret },
        });
        let responseJson = await response.json();
        if (response.ok) {
            return responseJson;
        } else {
            console.log(`${error} - ${responseJson}`);
            throw new Error(`${error} - ${responseJson}`);
        }
    } catch (_ex) {
        console.log({ _ex });
    }
}

export const getSymbols = async () => {
    return await getFinnhubApi('https://finnhub.io/api/v1/stock/symbol?', { 'exchange': 'US' });
}

export const getCompanyNews = async (_symbol) => {
    return await getFinnhubApi('https://finnhub.io/api/v1/company-news?', {
        'from': moment(new Date()).subtract(duration, "days").format("YYYY-MM-DD"),
        'to': moment(new Date()).format("YYYY-MM-DD"),
        'symbol': _symbol,
    });
}

export const getNews = async () => {
    return await getFinnhubApi('https://finnhub.io/api/v1/news?', {
        'from': moment(new Date()).subtract(duration, "days").format("YYYY-MM-DD"),
        'to': moment(new Date()).format("YYYY-MM-DD"),
        'category': 'general',
    });
}

export const getStocksWithSymbol = async (_symbol) => {
    const data = await getFinnhubApi('https://finnhub.io/api/v1/stock/candle?', {
        'from': parseInt(moment(new Date()).subtract(7, "days").valueOf() / 1000),
        'to': parseInt(moment(new Date()).valueOf() / 1000),
        'symbol': _symbol,
        'resolution': 30, // 1, 5, 15, 30, 60, D, W, M
    }).then(_data => {
        let stocks = [];
        let volumes = []
        for (var i = 0; i < _data.c.length; i++) {
            const _time = new Date(_data.t[i] * 1000);
            stocks.push({
                x: _time,
                y: [_data.o[i], _data.h[i], _data.l[i], _data.c[i]],
            })
            volumes.push({
                x: _time,
                y: _data.v[i],
            })
        }
        const minStock = Math.min(Math.min(..._data.o), Math.min(..._data.h), Math.min(..._data.l), Math.min(..._data.c));
        const maxStock = Math.max(Math.max(..._data.o), Math.max(..._data.h), Math.max(..._data.l), Math.max(..._data.c));
        const maxVolume = Math.max(..._data.v);

        return { stocks, volumes, minStock, maxStock, maxVolume }
    });
    return data;
}
