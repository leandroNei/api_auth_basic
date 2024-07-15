import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';

const createUser = async (req) => {
    const {
        name,
        email,
        password,
        password_second,
        cellphone
    } = req.body;
    if (password !== password_second) {
        return {
            code: 400,
            message: 'Passwords do not match'
        };
    }
    const user = await db.User.findOne({
        where: {
            email: email
        }
    });
    if (user) {
        return {
            code: 400,
            message: 'User already exists'
        };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
        name,
        email,
        password: encryptedPassword,
        cellphone,
        status: true
    });
    return {
        code: 200,
        message: 'User created successfully with ID: ' + newUser.id,
    }
};

const getUserById = async (id) => {
    return {
        code: 200,
        message: await db.User.findOne({
            where: {
                id: id,
                status: true,
            }
        })
    };
}

const updateUser = async (req) => {
    const user = db.User.findOne({
        where: {
            id: req.params.id,
            status: true,
        }
    });
    const payload = {};
    payload.name = req.body.name ?? user.name;
    payload.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
    payload.cellphone = req.body.cellphone ?? user.cellphone;
    await db.User.update(payload, {
        where: {
            id: req.params.id
        }

    });
    return {
        code: 200,
        message: 'User updated successfully'
    };
}

const deleteUser = async (id) => {
    /* await db.User.destroy({
        where: {
            id: id
        }
    }); */
    const user = db.User.findOne({
        where: {
            id: id,
            status: true,
        }
    });
    await  db.User.update({
        status: false
    }, {
        where: {
            id: id
        }
    });
    return {
        code: 200,
        message: 'User deleted successfully'
    };
}

const bulkCreateUsers = async (query) =>{
    let successCount = 0;
    let failureCount = 0;

    
}

const getAllUsers = async () => {
    console.log('Esta funcionando...');

    const users = await db.user.findAll({
        where: {
            status: true
        }
    });
    return {
        code: 200,
        masssage: users
    };
}

const findUsers = async (query) => {
    const whereCluse = {};
    if(query.eliminated !== undefined){
        whereCluse.status = query.eliminated === 'false';
    }
    if(query.name){
        whereCluse.name = {
            [db.Sequelize.Op.like]: `%${query.name}%`
        }
    }
    if(query.loggedInBefore){
        whereCluse.lastLogin = {
            [db.Sequelize.Op.lt]: new Date(loggedInBefore)
        }
    }
    if(query.loggedInAfter){
        whereCluse.lastLogin = {
            [db.Sequelize.Op.gt]: new Date(loggedInAfter)
        }
    }

    return {
        code: 200,
        message: await db.User.findAll({
            where: filtroWhere
        })
    }
}

export default {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
}