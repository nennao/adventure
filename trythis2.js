var i;
var fields = [];
var fieldsSet = new Set();

for (i=0; i<statusData.length; i++) {
    var field =  [statusData[i]['rec'], statusData[i]['subrec'], statusData[i]['profile']].join('-');
    if (!fieldsSet.has(field.toUpperCase())) {
        fields.push({
            'rec': statusData[i]['rec'],
            'subrec': statusData[i]['subrec'],
            'profile': statusData[i]['profile']
        });
        fieldsSet.add(field.toUpperCase());
    }
}
console.log(fields);
console.log(fieldsSet);


function getByClass(field) {
    if (field === 'recField') {
        return [
            {'value': 'BUCS1', 'checked': 1},
            {'value': 'BUCS2', 'checked': 0},
            {'value': 'EBAR1', 'checked': 1},
            {'value': 'EBAR2', 'checked': 0},
            {'value': 'EBAR3', 'checked': 1}
        ]
    }
    if (field === 'subrecField') {
        return [
            {'value': 'Positions'   ,   'checked': 0},
            {'value': 'Transactions',   'checked': 1},
            {'value': 'PNL'         ,   'checked': 0},
            {'value': 'CASH'        ,   'checked': 1},
            {'value': 'OTC_MLSEC'   ,   'checked': 0},
            {'value': 'RAMFXRL'     ,   'checked': 0},
            {'value': 'RAMPXRT'     ,   'checked': 0},
            {'value': 'CBAR'        ,   'checked': 0},
            {'value': 'GRS'         ,   'checked': 0},
            {'value': 'OFF_BALANCE' ,   'checked': 0},
            {'value': 'STOCK'       ,   'checked': 0}
        ]
    }
}

function xFilter(field, fields) {
    var i;

    if (field === 'rec') {
        return fields
    }

    var recChecklist = getByClass('recField'), recChecked = [];
    for (i=0; i<recChecklist.length; i++) {
        if (recChecklist[i].checked) recChecked.push(recChecklist[i].value) ;
    }
    var fields2 = recChecked.length ? fields.filter(function(d) {return recChecked.includes(d['rec'])}) : fields;
    if (field === 'subrec') {
        return fields2
    }

    var subrecChecklist = getByClass('subrecField'), subrecChecked = [];
    for (i=0; i<subrecChecklist.length; i++) {
        if (subrecChecklist[i].checked) subrecChecked.push(subrecChecklist[i].value) ;
    }
    if (field === 'profile') {
        if (!subrecChecked.length) return fields2;
        return fields2.filter(function(d) {return subrecChecked.includes(d['subrec'])})
    }
}

function getFieldList(field) {
    var fieldList = [];
    var fieldSet = new Set();
    var xFiltered = xFilter(field, fields);
    for (i = 0; i < xFiltered.length; i++) {
        if (!fieldSet.has(xFiltered[i][field].toUpperCase())) {
            fieldList.push(xFiltered[i][field]);
            fieldSet.add(xFiltered[i][field].toUpperCase());
        }
    }
    return fieldList
}

var recList = getFieldList('rec');
console.log(recList);

var subrecList = getFieldList('subrec');
console.log(subrecList);

var profileList = getFieldList('profile');
console.log(profileList);





