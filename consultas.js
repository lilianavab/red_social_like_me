import pkg from 'pg';
const { Pool } = pkg

const pool = new Pool({
    connectionString : 'postgresql://postgres:postgres@localhost:5432/likeme'
})

export const insertarPost = async( post ) => {
    // console.log( 'salida de post-->', post )
    let client
    const values = Object.values(post)

    const consulta = {
        name : "insert-post",
        text : "INSERT INTO posts ( usuario, url, descripcion ) VALUES ( $1, $2, $3 ) RETURNING *",
        values
    }
    try {
        client = await pool.connect();
        const response = await client.query(consulta)
        return response
    } catch (error) {
        return console.error('Error durante la conexión o la consulta:', error.stack)
    }finally{
        if(client){
            client.release();
        }
    }
}

export const mostrarPosts = async () => {
    let client;

    const consulta = {
        name: "fetch-data",
        text: "SELECT * FROM posts ORDER BY id ASC"
    };

    try {
        client = await pool.connect();
        const response = await client.query(consulta);
        return response;
    } catch (error) {
        console.error('Error durante la conexión o la consulta:', error.stack);
       // throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const actualizarLike = async (id) => {
    let client;

    try {
        const mostrarPostsId = async (id) => {
            const consulta = {
                name: "fetch-data-id",
                text: "SELECT * FROM posts WHERE id = $1",
                values: [id]
            };

            client = await pool.connect();
            const response = await client.query(consulta);
            return response;
        };

        const getLikeResponse = await mostrarPostsId(id);

        if (!getLikeResponse || !getLikeResponse.rows || getLikeResponse.rows.length === 0) {
            throw new Error(`No se encontró ningún post con el ID ${id}`);
        }

        const { likes } = getLikeResponse.rows[0];
        const contadorLike = likes + 1;

        const consulta = {
            name: "update-data",
            text: "UPDATE posts SET likes = $2 WHERE id = $1",
            values: [id, contadorLike]
        };

        client = await pool.connect();
        const result = await client.query(consulta);
        return result.rows;
    } catch (error) {
        console.error('Error durante la actualización del like:', error.stack);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};



