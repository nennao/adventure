var MMMs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var MMMMs = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function dateFromString(dateString, format=null) {  // yyyyMMdd, yyyy-MM-dd dd-MMM-yyyy
    var date, sep;
    var separators = ['-', '/', ' '];

    switch(format) {
        case 'yyyyMMdd':
            date = [dateString.substr(0, 4), dateString.substr(4, 2), dateString.substr(6, 2)];
            return new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]));
        case 'yyyy-MM-dd':
            date = dateString.split('-');
            return new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]));
        case 'dd-MMM-yyyy':
            date = dateString.split('-');
            return new Date(parseInt(date[2]), MMMs.indexOf(date[1]), parseInt(date[0]));
    }

    dateString = dateString.trim();

    for (var i=0; i<separators.length; i++) {
        if (dateString.includes(separators[i])) {
            sep = separators[i];
            date = parseSepDate(dateString, sep);
            break
        }
    }
    if (!sep && dateString.length === 8) {
        date = parseNonSepDate(dateString)
    }

    if (!date || isNaN(date.getDate())) throw 'invalid date';
    return date
}

function parseSepDate(dateString, sep) {
    var year, month, day;
    var dateArray = dateString.split(sep).map(function (d) {return d.trim()}).filter(function (d) {return d});
    if (dateArray.length !== 3) { return }
    year = dateArray[0].length === 4 ? parseInt(dateArray[0]) : parseInt(dateArray[2]);
    month = dateArray[1];
    month = MMMs.indexOf(month) > -1 ? MMMs.indexOf(month)
          : MMMMs.indexOf(month) > -1 ? MMMMs.indexOf(month)
          : parseInt(month) - 1;
    day = parseInt(dateArray[0]) === year ? parseInt(dateArray[2]) : parseInt(dateArray[0]);
    return new Date(year, month, day)
}

function parseNonSepDate(dateString) {
    var year, month, day;
    var yearCheck = parseInt(dateString.substr(4, 2)) > 12;
    year = parseInt(yearCheck ? dateString.substr(4, 4) : dateString.substr(0, 4));
    month = parseInt(yearCheck ? dateString.substr(2, 2) : dateString.substr(4, 2)) - 1;
    day = parseInt(yearCheck ? dateString.substr(0, 2) : dateString.substr(6, 2));
    return new Date(year, month, day)
}

var dates = [
    '2017-11-01',
    '2017/11/02',
    '2017 11 03',
    '2017-Nov-04',
    '2017-November-05',
    '2017-fcgh-01',
    '2017-11',
    '20171106',
    '07112017',
    '07112b17',
    '071127',
    '20172b01'
];

for (var i=0; i<dates.length; i++) {
    try {
        console.log(dateFromString(dates[i]));
    }
    catch (e) {
        console.log(e);
    }
}
console.log(dateFromString('20171108', 'yyyyMMdd'));
console.log(dateFromString('2017-11-09', 'yyyy-MM-dd'));
console.log(dateFromString('10-Nov-2017', 'dd-MMM-yyyy'));