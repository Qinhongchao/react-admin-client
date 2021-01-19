

const USER_KEY='user_key'

export default{
    saveUser(user){
        localStorage.setItem(USER_KEY,JSON.stringify(user))
    },

    getUser(){
        return  JSON.parse(localStorage.getItem(USER_KEY)||'{}') 
    },

    deleteUser(){
        localStorage.removeItem(USER_KEY)
    }
}