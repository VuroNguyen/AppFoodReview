import firebase from 'firebase';

class Fire {
    
    send = (messages) => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            };
            this.db.push(messages)
        });
    };

    parse = (messages) => {
        const {user, text, timestamp} = message.val()
        const {key: _id} = message
        const createAt = new Date(timestamp)

        return {
            _id,
            createAt,
            text
        }
    }

    get = (callback) => {
        this.db.on('child_added', snapshot => callback(this.parse(snapshot)));
    };

    off() {
        this.db.off()
    }

    get db() {
        return firebase.database().ref('messages');
    }
}

export default new Fire();