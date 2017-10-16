from flask import Flask
from flask import render_template
import MySQLdb
import simplejson
from sqlalchemy.engine.url import make_url

app = Flask(__name__)

db_url = make_url('mysql://root:@localhost/project2')


@app.route('/')
def index():
    """
    A Flask view to serve the main web page.
    """
    return render_template("index.html")


@app.route("/mockdata")
def mock_data():
    with open("/Users/nina/PycharmProjects/flasksql2/mockdata.json") as f:
        return f.read()


@app.route("/data")
def literacy_data():
    """
    A Flask view to serve the project data from
    SQL in JSON format.
    """
    db = MySQLdb.connect(db=db_url.database, host=db_url.host, user=db_url.username, passwd=db_url.password)

    try:
        lit = 'trial3'
        pop = 'trialPop'
        col_select = [lit + '.country_name', lit + '.country_code', lit + '.male', lit + '.female']
        col_select += ['{0}.{1}'.format(lit, year) for year in xrange(1960, 2016)]
        col_select += [pop + '.population', pop + '.region']
        columns = ', '.join(col_select)

        sql_str = "SELECT {0} FROM {1} INNER JOIN {2} ON {1}.country_name={2}.country_name ".format(columns, lit, pop)
        sql_str += "WHERE {0}.2015 ORDER BY {0}.2015".format(lit)

        cursor = db.cursor()
        cursor.execute(sql_str)

        column_names = [col[0] for col in cursor.description]
        data = [dict(zip(column_names, row)) for row in cursor]

        cursor.close()

        # for thing in data:
        #     print thing['country_name'], thing['2015']
        return simplejson.dumps(data)

    finally:
        db.close()
        print "connection closed"


if __name__ == '__main__':
    app.run(debug=True)
