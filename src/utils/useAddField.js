export default function useAddField ({
  setEmails
}) {
  const handleEmailChange = (value, position) => {
    setEmails((emails) => {
      return emails.map((email, index) => {
        return (index === position) ? value : email
      })
    })
  }

  const addEmptyEmail = (emptyEntries = ['']) => {
    setEmails((emails) => {
      return [
        ...emails,
        ...emptyEntries
      ]
    })
  }

  return {
    handleEmailChange,
    addEmptyEmail
  }
}
