class DetailedAccount {
    constructor({
        _id, type, value, from, to, date, accountId, anexo, urlAnexo, status
    }) {
        this.id =_id
        this.accountId = accountId
        this.type = type
        this.value = value
        this.from = from
        this.to = to
        this.date = date
        this.anexo = anexo
        this.urlAnexo = urlAnexo
        this.status = status || 'Pending'
    }
}

module.exports = DetailedAccount
