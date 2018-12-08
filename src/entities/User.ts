import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
    BeforeInsert, BeforeUpdate, JoinColumn,
} from 'typeorm';

import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, MaxLength, MinLength} from 'class-validator';

/**
 * User Entity
 */
@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'uuid',
        type: 'varchar',
        length: 150,
        unique: true,
    })
    uuid: string;

    @Column({
        name: 'email',
        type: 'varchar',
        length: 180,
        unique: true,
    })
    @IsEmail()
    @MaxLength(180, {
        message: 'Email is too long',
    })
    email: string;

    @Column({
        name: 'email_canonicalized',
        type: 'varchar',
        length: 180,
        unique: true,
    })
    emailCanonicalized: string;

    @Column({
        name: 'username',
        type: 'varchar',
        length: 50,
        unique: true,
    })
    @MinLength(3, {
        message: 'Username is too short',
    })
    @MaxLength(50, {
        message: 'Username is too long',
    })
    username: string;

    @Column({
        name: 'username_canonicalized',
        type: 'varchar',
        length: 50,
        unique: true,
    })
    usernameCanonicalized: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 150,
    })
    password: string;

    @Column({
        name: 'salt',
        type: 'varchar',
        length: 150,
    })
    salt: string;

    @Column({
        name: 'first_name',
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    @MaxLength(150, {
        message: 'First name is too long',
    })
    firstName: string;

    @Column({
        name: 'last_name',
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    @MaxLength(150, {
        message: 'Last name is too long',
    })
    lastName: string;

    @Column({
        name: 'display_name',
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    @MaxLength(150, {
        message: 'Display name is too long',
    })
    displayName: string;

    @Column({
        name: 'activation_code',
        type: 'varchar',
        length: 150,
    })
    activationCode: string;

    @Column({
        name: 'roles',
        type: 'simple-array',
    })
    roles: string[] = [];

    @Column()
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt: Date;

    @ManyToOne(
        type => User,
        {
            nullable: true,
        },
    )
    @JoinColumn({
        name: 'created_by_id',
    })
    createdBy: User;

    @Column()
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;

    @ManyToOne(
        type => User,
        {
            nullable: true,
        })
    @JoinColumn({
        name: 'updated_by_id',
    })
    updatedBy: User;

    @Column({
        name: 'is_email_confirmed',
        type: 'boolean',
        default: false,
    })
    isEmailConfirmed: boolean;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    /**
     *
     * @param {string} email
     * @param {string} username
     * @param {string} password
     * @param {string} salt
     * @param {string} displayName
     * @param {string} activationCode
     * @param {string[]} roles
     * @param {boolean} isEmailConfirmed
     * @param {boolean} isActive
     */
    constructor(displayName?: string,
                email?: string,
                username?: string,
                password?: string,
                salt?: string,
                activationCode?: string,
                roles?: string[],
                isEmailConfirmed?: boolean,
                isActive?: boolean) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.displayName = displayName;
        this.activationCode = activationCode;
        this.roles = roles;
        this.isEmailConfirmed = isEmailConfirmed;
        this.isActive = isActive;
    }

    addRole(role: string): User {
        if (!this.roles) {
            this.roles = [];
        }
        if (this.roles.indexOf(role) === -1) {
            this.roles.push(role);
        }
        return this;
    }

    hasRole(role: string): boolean {
        if (this.roles.indexOf(role) === -1 && role !== 'ROLE_USER') {
            return false;
        }
        return true;
    }

    @BeforeInsert()
    beforeCreate() {
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        if (!this.emailCanonicalized) {
            this.emailCanonicalized = (this.email) ? this.email.toLowerCase() : null;
        }
        if (!this.usernameCanonicalized) {
            this.usernameCanonicalized = (this.username) ? this.username.toLowerCase() : null;
        }
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updatedAt = new Date();
    }

}
