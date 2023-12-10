import { tsvParse, csvParse } from "d3-dsv";
import moment from "moment";

function parseData() {
    return function (d) {
        d.date = new Date(d.date);//.format("YY-MM-DD");
        // d.date = moment(d.date).format("YY/MM/DD");
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.volume;

        return d;
    };
}

//  https://www.marketwatch.com/investing/stock/csv/download-data
//  https://www.marketwatch.com/investing/stock/csv/downloaddatapartial?startdate=08/02/2023%2000:00:00&enddate=09/01/2023%2023:59:59&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false

//https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv

export function getMSFT() {
    const promiseMSFT = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
        .then(response => response.text())
        .then(data => tsvParse(data, parseData()))
        .then(data => {
            return {
                stocks: data.map(_item => { return { x: _item.date, y: [_item.open, _item.high, _item.low, _item.close] } }),
                volumes: data.map(_item => { return { x: _item.date, y: _item.volume } }),
            }
        });
    return promiseMSFT;
}

export function convertToInternationalCurrencySystem (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue));

}
