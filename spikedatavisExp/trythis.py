import simplejson
from pprint import pprint


def dataToJSON(filepath):
    cols_to_delete = ["date", "time", "thread_name", "run_time"]
    calc = {
        'runTimes': 0,
        'rulesRunTimes': 0,
    }

    with open(filepath) as f:
        column_names = f.readline().strip().split(',')
        # print ', '.join(column_names)

        data = []
        rowTemplate = {}

        for row in f:
            row = dict(zip(column_names, row.strip().split(',')))
            if row["function_name"] == 'additionalTablesForEbar3CBAR':
                continue
            if row["substage"]:
                calc['runTimes'] += float(row["run_time_sec"])
            if row["function_name"] == 'run':
                calc['runRunTime'] = float(row["run_time_sec"])

            if row["function_name"] == 'executeGraph':
                calc['execGraphRunTime'] = float(row["run_time_sec"])
            elif row["stage"] == 'RunRules':
                calc['rulesRunTimes'] += float(row["run_time_sec"])

            calc['name'] = row['rec_id']

            if row["flags"] == 'RECINFOFLAG' or not row["substage"]:
                continue
            for col in cols_to_delete:
                del row[col]
            data.append(row)
            rowTemplate = row
        print
        pprint(calc)
        print 'other_rules:', calc['execGraphRunTime'] - calc['rulesRunTimes']
        print 'other:', calc['runRunTime'] - calc['runTimes'], 'or', calc['runRunTime'] - calc['runTimes'] - (calc['execGraphRunTime'] - calc['rulesRunTimes'])
        print
        otherRulesRow = {k:v for k,v in rowTemplate.items()}
        otherRulesRow['run_time_sec'] = calc['execGraphRunTime'] - calc['rulesRunTimes']
        otherRulesRow['stage'], otherRulesRow['substage'], otherRulesRow['function_name'] = 'RunRules', 'OtherRules', 'OtherRules'

        otherRow = {k:v for k,v in rowTemplate.items()}
        otherRow['run_time_sec'] = calc['runRunTime'] - calc['runTimes'] - (calc['execGraphRunTime'] - calc['rulesRunTimes'])
        otherRow['stage'] = otherRow['substage'] = otherRow['function_name'] = 'other'

        data.append(otherRulesRow)
        data.append(otherRow)
        # data = [dict(zip(column_names, row.strip().split(','))) for row in f.readlines()]
        return simplejson.dumps(data)


def writeData(filepath, dataDumps):
    with open(filepath, 'w') as f:
        data = []
        for dump in dataDumps:
            data.append(dump.replace('}, ', '},\n')[1:-1])
        f.write('var myData = [\n')
        f.write(',\n'.join(data))
        f.write('\n];\n')



def newLineData():
    with open('/Users/nina/Documents/datadash/rawdata.txt') as f:
        data = f.read()
        # print data[:500]
        data = data.replace('}, ', '},\n')
    print data


a = dataToJSON('/Users/nina/PycharmProjects/spikedatavisExp/datavis/bucs1_positions_testfiles_COB20171003_TIMESTAMP20171012_004213__TIMING_DETAILED.csv')
b = dataToJSON('/Users/nina/PycharmProjects/spikedatavisExp/datavis/ebar1_positions_testfiles_COB20171004_TIMESTAMP20171012_000333__TIMING_DETAILED.csv')
c = dataToJSON('/Users/nina/PycharmProjects/spikedatavisExp/datavis/ebar2_rampxrt_testfiles_COB20171004_TIMESTAMP20171011_235858__TIMING_DETAILED.csv')
d = dataToJSON('/Users/nina/PycharmProjects/spikedatavisExp/datavis/ebar3_cbar_testfiles_COB20171003_TIMESTAMP20171012_143956__TIMING_DETAILED.csv')

# print a
# print
# print b
print writeData('/Users/nina/PycharmProjects/spikedatavisExp/static/js/rawdataExp.js', [a,b,c,d])
