import pool from "../db.js"


export const busroute=(req,res)=>{
    const {src,dst}=req.query;
    if (!src||!dst){
        return res.status(400).send("Please enter all the informations properly...");
    }
    else{
        pool.getConnection((err,connection)=>{

            if (err){
                return res.status(500).send("Something went wrong");
            }
            else{
                const qr = `     SELECT 
                                        r.source,
                                        r.destination,
                                        r.distance,
                                        t.trip_id,
                                        t.date,
                                        t.departure_time,
                                        t.arrival_time,
                                        t.fare,
                                        v.vehicle_id,
                                        v.bus_number,
                                        v.type AS bus_type,
                                        v.total_seats
                                    FROM Routes r
                                    JOIN Trips t 
                                        ON r.route_id = t.route_id
                                    JOIN Vehicles v 
                                        ON t.vehicle_id = v.vehicle_id
                                    WHERE 
                                        r.source = ?
                                        AND r.destination = ?
                                        AND t.trip_status = 'scheduled'
                                        AND t.date >= CURDATE()
                                    ORDER BY 
                                        t.date ASC,
                                        t.departure_time ASC
                                    `;


                connection.query(qr,[src,dst],(err,result)=>{

                    connection.release();

                    if (err){
                        return res.status(500).send("Something went wrong");
                    }
                    else{
                        return res.status(200).send(result);
                    }



                })




            }

        })

    }
}