const User = require('../models/User');
const bcrypt = require('bcrypt');
const { genneralAccessToken, genneralRefreshToken, generateTokenAndSetCookie, generateJWTToken } = require('./JwtService');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, username, phone, gender, dateOfBirth, password, confirmPassword } = newUser;

        try {
            const checkUser = await User.findOne({
                phone: phone,
            });
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    massage: 'User already exists',
                });
            }
            const hash = bcrypt.hashSync(password, 10);
            console.log('hash', hash);
            const createUser = await User.create({
                name,
                username,
                phone,
                gender,
                dateOfBirth,
                password: hash,
                confirmPassword,
            });
            if (createUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createUser,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { username, password } = userLogin;

        try {
            const checkUser = await User.findOne({
                username: username,
            });
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined',
                });
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            // console.log('comparePassword', comparePassword);

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password is incorrect',
                });
            }
            const accessToken = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });
            const refreshToken = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                accessToken,
                refreshToken,
                userLogin: checkUser,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            console.log('checkUser', checkUser);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
            console.log('id update', id);
            console.log('data update', data);
            console.log('updateUserFindByIDAndUpdate', updateUser);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser,
            });
            console.log('updateUser', updateUser);
        } catch (e) {
            reject(e);
        }
    });
};
const addFriend = (id, newFriend) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            console.log('new friend', newFriend);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }

            checkUser.phoneBooks.push(newFriend);

            const updatedUser = await checkUser.save();
            
          
            resolve({
                status: 'OK',
                message: 'Friend added successfully',
                data: updatedUser,
            });
        } catch (error) {
           
            reject(error);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            // console.log('checkUser', checkUser);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            await User.findByIdAndDelete(id);
            
            resolve({
                status: 'OK',
                message: 'DELETE USER SUCCESS',
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });
            if (user === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailByPhone = (phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ phone: phone });
            console.log(user)
            if (user == null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};
const  getAllFriend = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });
            console.log(user)
            if (user == null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user.phoneBooks,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

// add invite
const addInvite = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            console.log('checkUser', checkUser);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
                // Tạo một bản sao của mảng invite và thêm dữ liệu mới vào đó
                // const newInviteArray = [...checkUser.invite ];
                // checkUser.invite.push({
                //     id: data.invite.id,
                //     name: data.invite.name,
                //     phone: data.invite.phone
                // })

            checkUser.invite.push(data)
            const updateUser = await checkUser.save();
            console.log('updateUser', updateUser);
            // console.log('access_Token', access_Token);
            // await User.findOneAndUpdate

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};
// ad loi moi cua ban than. xem ban than da gui loi moi cho nhung ai
const addListFriend = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            console.log('checkUser', checkUser);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
                // Tạo một bản sao của mảng invite và thêm dữ liệu mới vào đó
                // const newInviteArray = [...checkUser.invite ];
                // checkUser.invite.push({
                //     id: data.invite.id,
                //     name: data.invite.name,
                //     phone: data.invite.phone
                // })

            checkUser.listAddFriend.push(data)
            const updateUser = await checkUser.save();
            console.log('updateUser', updateUser);
            // console.log('access_Token', access_Token);
            // await User.findOneAndUpdate

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    addFriend,
    getAllUser,
    getDetailsUser,
    getDetailByPhone,
    getAllFriend,
    addInvite,
    addListFriend,
};
