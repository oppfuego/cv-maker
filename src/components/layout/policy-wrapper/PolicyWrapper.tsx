import React, {FC} from 'react';
import styles from './PolicyWrapper.module.scss';

interface PolicyWrapperProps{
    children: React.ReactNode;
}

const PolicyWrapper:FC<PolicyWrapperProps> = ({children}) => {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    );
};

export default PolicyWrapper;