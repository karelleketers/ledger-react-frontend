import {gql} from '@apollo/client';

export const REGISTER_USER_MUTATION = gql `
    mutation register($email: String! $password: String! $firstName: String! $lastName: String!) {
    register(registerInput: {
        email: $email,
        password: $password,
        firstName: $firstName,
        lastName: $lastName
  }) {
    id,
    email,
  }
}
`

export const LOGIN_USER_MUTATION = gql `
    mutation login($email: String! $password: String!) {
    login(loginInput: {
        email: $email,
        password: $password
  }) {
    token
  }
}
`

export const REMOVE_USER = gql `
    mutation removeUser{
      removeUser {
        id
      }
}
`

export const LOAD_REFRESHTOKEN = gql `
    mutation refreshToken {
    refreshToken {
    token
  }
}
`

export const EDIT_USER_DATA = gql`
    mutation updateUserDetails($id: Int! $profileId: Int! $bank: String!) {
        updateUserDetails(input: {
          id: $id,
          profileId: $profileId,
          bank: $bank,
        }) {
          id,
          bank
        }
    }
`

export const SKIP_QUESTIONNAIRE = gql`
  mutation skipQuestionnaire {
    skipQuestionnaire {
      onboarding
    }
  }
`

export const SET_QUESTIONNAIRE = gql`
    mutation updateQuestionnaire($ageGroup: Int! $improve: String! $savedLastMonth: Boolean! $goal: Boolean! $balance: Int $savings: Int) {
        updateQuestionnaire(input: {
          ageGroup: $ageGroup,
          improve: $improve,
          savedLastMonth: $savedLastMonth,
          goal: $goal,
          balance: $balance,
          savings: $savings
        }) {
          id
        }
    }
`

export const SET_PROFILE = gql`
    mutation updateOwnProfile($firstName: String $lastName: String $bank: String $reminder: Boolean) {
        updateOwnProfile(input: {
          firstName: $firstName,
          lastName: $lastName,
          bank: $bank
          reminder: $reminder
        }) {
          id,
          firstName,
          lastName,
          bank,
          reminder
        }
    }
`
export const SET_ENTRY = gql`
    mutation createEntry($incoming: Boolean! $amount: Int! $category: String $description: String $type: String $categoryId: Int) {
        createEntry(input: {
          incoming: $incoming,
          amount: $amount,
          category: $category,
          description: $description,
          type: $type,
          categoryId: $categoryId,
        }) {
          id,
          incoming,
          amount,
          category,
          description,
          type,
        }
    }
`

export const EDIT_ENTRY = gql`
    mutation updateEntry($id: Int! $incoming: Boolean! $amount: Int! $category: String $description: String $type: String) {
      updateEntry(input: {
          id: $id,
          incoming: $incoming,
          amount: $amount,
          category: $category,
          description: $description,
          type: $type,
        }) {
          id,
          incoming,
          amount,
          category,
          description,
          type
        }
    }
`

export const DELETE_ENTRY = gql`
    mutation removeEntry($id: Float!) {
      removeEntry(id: $id) {
          id
        }
    }
`


export const SET_LOAN = gql`
    mutation createLoan($invite: String! $owed: Boolean! $amount: Int! $paid: Boolean! $reason: String) {
        createLoan(input: {
          invite: $invite,
          owed: $owed,
          amount: $amount,
          paid: $paid,
          reason: $reason
        }) {
          id,
          amount,
          paid,
          reason,
          userloans {
            owed,
            inviteEmail,
            inviteName
          }
        }
    }
`

export const SET_BILL = gql`
    mutation createBill($amount: Int! $name: String!) {
        createBill(input: {
          amount: $amount,
          name: $name,
        }) {
          id,
          amount,
          name
        }
    }
`

export const EDIT_BILL = gql`
    mutation updateBill($id: Int! $amount: Int! $name: String! $paid: Boolean!) {
      updateBill(input: {
          id: $id,
          amount: $amount,
          name: $name,
          paid: $paid
        }) {
          id,
          amount,
          name,
          paid
        }
    }
`

export const DELETE_BILL = gql`
    mutation removeBill($id: Float!) {
      removeBill(id: $id) {
          id
        }
    }
`

export const EDIT_LOAN = gql`
    mutation updateLoan($id: Int! $invite: String! $owed: Boolean! $amount: Int! $paid: Boolean! $reason: String) {
      updateLoan(input: {
          id: $id,
          invite: $invite,
          owed: $owed,
          amount: $amount,
          paid: $paid,
          reason: $reason
        }) {
          id,
          amount,
          paid,
          reason,
          userloans {
            owed,
            inviteEmail,
            inviteName
          }
        }
    }
`

export const DELETE_LOAN = gql`
    mutation removeLoan($id: Float!) {
      removeLoan(id: $id) {
          id,
        }
    }
`

export const EDIT_CATEGORY = gql`
    mutation updateCategory($id: Int! $name: String! $hidden: Boolean $total: Int $current: Int! $categoryIconId: Int) {
      updateCategory(input: {
          id: $id,
          name: $name,
          total: $total,
          hidden: $hidden,
          categoryIconId: $categoryIconId,
          current: $current
        }) {
          id,
          name,
          total,
          hidden,
          categoryIconId,
          current
        }
    }
`


export const DELETE_CATEGORY = gql`
    mutation removeCategory($id: Float!) {
      removeCategory(id: $id) {
          id,
        }
    }
`

export const EDIT_SAVINGS = gql`
    mutation updateSavings($id: Int! $name: String! $goal: Int! $goal_date: Timestamp $amount: Int! $type: String!) {
      updateSavings(input: {
          id: $id,
          name: $name,
          amount: $amount,
          goal: $goal,
          goal_date: $goal_date,
          type: $type
        }) {
          id,
          name,
          amount,
          goal,
          goal_date,
          type
        }
    }
`


export const DELETE_SAVINGS = gql`
    mutation removeSavings($id: Float!) {
      removeSavings(id: $id) {
          id,
        }
    }
`

export const SET_SAVINGS = gql`
    mutation createSavings($name: String! $goal: Int! $goal_date: Timestamp $amount: Int! $type: String!) {
        createSavings(input: {
          amount: $amount,
          name: $name,
          goal: $goal,
          goal_date: $goal_date,
          type: $type
        }) {
          id,
          amount,
          name,
          goal,
          goal_date,
          type
        }
    }
`

export const SET_MONTHLY_SAVINGS = gql`
    mutation updateMonthlySavings($id: Int! $monthly_savings: String!) {
      updateMonthlySavings(input: {
        id: $id,
        monthly_savings: $monthly_savings
        }) {
          id,
          total,
          unassigned,
          monthly_savings
        }
    }
`

export const ADJUST_SAVINGS_BALANCE = gql`
    mutation updateSavingsEntry($amount: Int! $incoming: Boolean!) {
      updateSavingsEntry(input: {
        amount: $amount,
        incoming: $incoming,
      }) {
          id,
          total,
          unassigned,
          monthly_savings
        }
    }
`

export const ASSIGN_SAVINGS = gql`
    mutation assignSavings($amount: Int! $incoming: Boolean! $savingsId: Int!) {
      assignSavings(input: {
        amount: $amount,
        incoming: $incoming,
        savingsId: $savingsId,
      }) {
          id,
          total,
          unassigned,
          monthly_savings
          
        }
    }
`

export const SET_CATEGORY = gql`
    mutation createCategory($name: String! $total: Int! $hidden: Boolean! $categoryIconId: Int! $current: Int!) {
        createCategory(input: {
          name: $name,
          total: $total,
          current: $current,
          hidden: $hidden,
          categoryIconId: $categoryIconId
        }) {
          id,
          name,
          total,
          current,
          hidden,
          categoryIconId
        }
    }
`