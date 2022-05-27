const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "habuild",
  password: "password",
  port: 5432,
});

const jwt = require("jsonwebtoken")

const login = (request,response) => {
    const user = {
        id : 1,
        username : 'fred',
        email : 'fred@example.com'
    }

    jwt.sign({user},'secretkey',{expiresIn : '1m'},(error,token) => {
        response.json({token})
    })
}

function verifyToken(request,response,next) {
    const bearerHeader = request.headers['authorization']
    if(typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(' ')
        const bearertoken = bearer[1];
        request.token = bearertoken
        next();
    }
    else {
        response.status(403).send('No token provided.');
    }
}

const getRank = (request, response) => {
  pool.query('select t.id,t.name,r.ranking from topics as t,rankings as r where t.id=r.tid order by t.id asc',(error,results) => {
    if(error) {
        throw error;
    }
    response.status(200).json(results.rows);
  });
};
const getRankById = (request,response) => {
    const id = parseInt(request.params.id);

    pool.query('select t.id,t.name,r.ranking from topics as t,rankings as r where t.id=$1 and r.tid=$2',
                [id,id],
                (error,results) => {
                    if(error) {
                        throw error;
                    }
                    response.status(200).json(results.rows);
                }
    )
}

const changeRank = (request,response) => {
    jwt.verify(request.token,'secretkey',(error) => {
        if(error) {
            response.status(403).send('Unauthorized Access.')
        }
        else {

            const{name,ranking} = request.body
        
            pool.query('select distinct t.id,t.name,r.ranking from topics as t,rankings as r where t.name=$1 and t.id=r.tid',[name],(error,results) => {
                if(error) {
                    throw error
                }
                if(results.rowCount!=0) {
                    const id = results.rows.at(0).id;
                    pool.query('update rankings set ranking = $1 where tid = $2',[ranking,id],(error,results) => {
                        if(error) {
                            throw error
                        }
                        response.status(200).send('rank updated');
                    })
                }
                else {
                    pool.query('insert into topics(name) values ($1)',[name],(error,results) => {
                        if(error) {
                            throw error
                        }
                        pool.query('insert into rankings(ranking,tid) values ($1,(select id from topics where name=$2))',[ranking,name],(error,results) => {
                            if(error) {
                                throw error
                            }
                            response.status(200).send('New topic added')
                        })
                    })
                }
            })
        }
    })
}
module.exports = {
    getRank,
    getRankById,
    changeRank,
    verifyToken,
    login
}
