import { useEffect, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_PROFILE } from '../../../GraphQL/Queries'
import { SET_PROFILE } from '../../../GraphQL/Mutations';
import { useAuth } from '../../Hooks';
import { Link } from 'react-router-dom';

interface Profile {
    id: null | number,
    firstName: string
    lastName: string,
    bank: string,
    reminder: boolean
}

export const ProfilePage = () => {
    const auth = useAuth();
    const {data: queryProfileData} = useQuery(LOAD_PROFILE);

    const [updateNewProfile] = useMutation(SET_PROFILE);
    const [profile, setProfile] = useState<Profile>({
        id: null,
        firstName: "",
        lastName: "",
        bank: "",
        reminder: false
    });

    useEffect(() => {
        if (queryProfileData) {
            const data = queryProfileData.getOwnProfile;
            const { __typename, ...rest } = data;
            setProfile(rest);
        }
    }, [queryProfileData]);

    const updateProfile = (e: any) => {
        e.preventDefault()
        updateNewProfile({
            variables: {
                firstName: profile.firstName,
                lastName: profile.lastName,
                bank: profile.bank,
                reminder: profile.reminder,
            }
        });
    }

    return (
        <>
        {auth.onboarding !== "finished" && <div>
            Don't forget to fill in the questionnaire if you can. <Link to ="/onboarding">Yes, take me there!</Link>
        </div>}
        <form>
            <input type="First Name"
            placeholder={profile.firstName}
            onChange={(e) => {
                setProfile({
                    ...profile,
                    firstName: e.target.value
                });
            }}
            />
            <input type="Last Name"
            placeholder={profile.lastName}
            onChange={(e) => {
                setProfile({
                    ...profile,
                    lastName: e.target.value
                });
            }}
            />
            <input type="Bank"
            placeholder={profile.bank}
            onChange={(e) => {
                setProfile({
                    ...profile,
                    bank: e.target.value
                });
            }}
            />
            <button onClick={updateProfile}>Save</button>
        </form>
        <form>
            <label>Set Reminder</label>
            <input type="checkbox" checked={profile.reminder} onChange={() => setProfile({...profile, reminder: !profile.reminder})}/>
            <button onClick={updateProfile}>Save</button>
        </form>
        </>
    )
}