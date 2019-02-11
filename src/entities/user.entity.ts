import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
    BeforeInsert, BeforeUpdate, JoinColumn,
} from 'typeorm';
import { Exclude, Type, Transform } from 'class-transformer';
import {Moment} from "moment";
import * as moment from "moment";

import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, MaxLength, MinLength} from 'class-validator';
import { IsUserAlreadyExist } from './../validators/is-user-exist.validator';
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * User Entity
 */
@Entity()
export default class User {

    public static ROLE_USER: string = 'ROLE_USER';
    public static ROLE_APPLICATION: string = 'ROLE_APPLICATION';
    public static ROLE_ADMIN: string = 'ROLE_ADMIN';
    public static ROLE_SUPER_ADMIN: string = 'ROLE_SUPER_ADMIN';

    @Exclude()
    @PrimaryGeneratedColumn()
    private id: number;

    @ApiModelProperty()
    @Column({
        name: 'uuid',
        type: 'varchar',
        length: 50,
        unique: true,
    })
    public uuid: string;

    @ApiModelProperty()
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
    @IsUserAlreadyExist({
        message: "Email $value already exists. Choose another email.",
    })
    public email: string;

    @Column({
        name: 'email_canonicalized',
        type: 'varchar',
        length: 180,
        unique: true,
    })
    @Exclude()
    public emailCanonicalized: string;

    @ApiModelProperty()
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
    @IsUserAlreadyExist({
        message: "Username $value already exists. Choose another username.",
    })
    public username: string;

    @Column({
        name: 'username_canonicalized',
        type: 'varchar',
        length: 50,
        unique: true,
    })
    @Exclude()
    public usernameCanonicalized: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 150,
    })
    @Exclude()
    public password: string;

    @Column({
        name: 'salt',
        type: 'varchar',
        length: 150,
    })
    @Exclude()
    public salt: string;

    @ApiModelProperty()
    @Column({
        name: 'first_name',
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    @MaxLength(150, {
        message: 'First name is too long',
    })
    public firstName: string;

    @ApiModelProperty()
    @Column({
        name: 'last_name',
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    @MaxLength(150, {
        message: 'Last name is too long',
    })
    public lastName: string;

    @ApiModelProperty()
    @Column({
        name: 'display_name',
        type: 'varchar',
        length: 300,
        nullable: true,
    })
    @MaxLength(300, {
        message: 'Display name is too long',
    })
    public displayName: string;

    @Column({
        name: 'activation_code',
        type: 'varchar',
        length: 150,
    })
    @Exclude()
    public activationCode: string;

    @ApiModelProperty()
    @Column({
        name: 'roles',
        type: 'simple-array',
    })
    public roles: string[] = [];

    @ApiModelProperty()
    @Column({
        name: 'last_login_at',
        type: 'timestamp',
        nullable: true,
    })
    @Transform(value => moment(value).format('YYYY-MM-DD HH:mm:ssZ'))
    public lastLoginAt: Date;

    @ApiModelProperty()
    @Column()
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    @Transform(value => moment(value).format('YYYY-MM-DD HH:mm:ssZ'))
    public createdAt: Date;

    @ManyToOne(
        type => User,
        {
            nullable: true,
        },
    )
    @JoinColumn({
        name: 'created_by_id',
    })
    public createdBy: User;

    @ApiModelProperty()
    @Column()
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    @Transform(value => moment(value).format('YYYY-MM-DD HH:mm:ssZ'))
    public updatedAt: Date;

    @ManyToOne(
        type => User,
        {
            nullable: true,
        })
    @JoinColumn({
        name: 'updated_by_id',
    })
    public updatedBy: User;

    @ApiModelProperty()
    @Column({
        name: 'is_email_confirmed',
        type: 'boolean',
        default: false,
    })
    public isEmailConfirmed: boolean;

    @ApiModelProperty()
    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
    })
    public isActive: boolean;

    /**
     * To create a new user object you must not use this constructor directly
     * You must use the createUser method that belongs to UserService class instead
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
    constructor(email?: string,
                username?: string,
                password?: string,
                roles?: string[],
                isEmailConfirmed?: boolean,
                isActive?: boolean,
                displayName?: string,
                salt?: string,
                activationCode?: string) {
        this.displayName = displayName;
        this.email = email;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.activationCode = activationCode;
        this.isActive = isActive || false;
        this.roles = roles || [];
        this.isEmailConfirmed = isEmailConfirmed || false;
    }

    public getId(): number {
        return this.id;
    }

    private standardizedRoleName(role: string): string {
        let roleStandardized = role.toUpperCase();
        if (roleStandardized.indexOf('ROLE_') !== 0) {
            roleStandardized = `ROLE_${roleStandardized}`;
        }
        return roleStandardized;
    }

    public addRole(role: string): User {
        if (!this.roles) {
            this.roles = [];
        }
        const roleStandardized = this.standardizedRoleName(role);
        if (this.roles.indexOf(roleStandardized) === -1) {
            this.roles.push(roleStandardized);
        }
        return this;
    }

    public hasRole(role: string): boolean {
        if (this.roles.indexOf(role) === -1 && role !== 'ROLE_USER') {
            return false;
        }
        return true;
    }

    public hasOneOfTheseRoles(roles: Array<string>): boolean {
        let filteredRoles = this.roles.filter((userRole) => roles.includes(userRole)?true:false);
        if (filteredRoles.length === 0) {
            return false;
        }
        return true;
    }

    public setUsernameCanonicalized(username?: string): void {
        if (username) {
            this.usernameCanonicalized = (username) ? username.toLowerCase() : null;
        }
        else {
            this.usernameCanonicalized = (this.username) ? this.username.toLowerCase() : null;
        }
    }

    public setEmailCanonicalized(email?: string): void {
        if (email) {
            this.emailCanonicalized = (email) ? email.toLowerCase() : null;
        }
        else {
            this.emailCanonicalized = (this.email) ? this.email.toLowerCase() : null;
        }
    }

    @BeforeInsert()
    beforeCreate() {
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.updatedBy = this.createdBy;
        if (!this.displayName) {
            this.displayName = `${this.firstName} ${this.lastName}`;
        }
        if (!this.emailCanonicalized) {
            this.setEmailCanonicalized(this.email);
        }
        if (!this.usernameCanonicalized) {
            this.setUsernameCanonicalized(this.username);
        }
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updatedAt = new Date();
    }

}
