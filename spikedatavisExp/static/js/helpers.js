function getMalePop(population, tRate, mRate, fRate) {
    if (tRate === mRate || tRate === fRate || mRate === fRate) {
        return Math.round(population / 2);
    }
    return Math.round((population * (tRate - fRate)) / (mRate - fRate));
}


function getFemalePop(population, malePop) {
    return population - malePop;
}


function createRow(d, gender, pop, count) {
    return {
        "current_id": count,
        "country_name": d["country_name"],
        "country_code": d["country_code"],
        "region": d["region"],
        "population": pop,
        "gender": gender,
        "current": d[gender]
    };
}

function createHistoryRow(d, count) {
    return {
        "history_id": count,
        "country_name": d["country_name"],
        "country_code": d["country_code"],
        "region": d["region"],
        "population": d["population"],
        "year": Math.floor((Math.random() * 59) + 1960),
        "rate": d["2015"]
    };
}

function avgAdd(p, v) {
    p.country = v["country_name"];
    p.count += v["population"];
    p.total += v["current"] * v["population"];
    p.avg = p.total / p.count;
    return p;
}

function avgRem(p, v) {
    p.count -= v["population"];
    p.total -= v["current"] * v["population"];
    p.avg = p.count ? p.total / p.count : 0;
    return p;
}

function avgInit() {
    return {count: 0, total: 0, avg: 0};
}

