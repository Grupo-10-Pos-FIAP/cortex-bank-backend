const DetailedAccountModel = require("../../models/DetailedAccount")

const saveTransaction = async ({
    transaction, repository
}) => {
  const shouldReverseValue = (transaction.type === 'Debit' && transaction.value > 0) || (transaction.type === 'Credit' && transaction.value < 0)
  if (shouldReverseValue) transaction.value = transaction.value * -1
  
  const transactionData = {
    accountId: transaction.accountId,
    value: transaction.value,
    type: transaction.type,
    from: transaction.from,
    to: transaction.to,
    anexo: transaction.anexo,
    urlAnexo: transaction.urlAnexo,
    date: transaction.date,
    status: transaction.status || 'Pending'
  }
  
  const resultado = await repository.create(transactionData)
  return new DetailedAccountModel(resultado.toJSON())
}

module.exports = saveTransaction