import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
    BeforeInsert, BeforeUpdate, JoinColumn, Index,
} from 'typeorm';
import { Exclude, Type, Transform } from 'class-transformer';
import {Moment} from "moment";
import * as moment from "moment";

import {Contains, IsInt, Length, IsEmail, IsDate, Min, Max, MaxLength, MinLength, IsIn, IsUrl} from 'class-validator';
import { IsUserAlreadyExist } from './../validators/is-user-exist.validator';
import { ApiModelProperty } from '@nestjs/swagger';
import User from './user.entity';

/**
 * Application Entity
 */
@Entity()
@Index(["apiKey", "apiKeySecret"])
export default class Application {

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
        name: 'name',
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    @MaxLength(100, {
        message: 'Application name is too long',
    })
    public name: string;

    @ApiModelProperty()
    @Column({
        name: 'description',
        type: 'varchar',
        length: 300,
        nullable: true,
    })
    @MaxLength(300, {
        message: 'Application description is too long',
    })
    public description: string;

    @ApiModelProperty()
    @Column({
        name: 'platform',
        type: 'varchar',
        length: 15,
        nullable: true,
    })
    @IsIn(['web', 'ios', 'android', 'desktop', 'windows-mobile'])
    public platform: string;

    @ApiModelProperty()
    @Column({
        name: 'main_picture',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    @IsUrl({protocols: ['https']}, {message: 'It should have a valid URL from a secure host.'})
    public mainPicture: string;

    @ApiModelProperty()
    @Column({
        name: 'api_key',
        type: 'varchar',
        length: 60,
        unique: true,
    })
    @MaxLength(60, {
        message: 'API Key is too long',
    })
    public apiKey: string;

    @ApiModelProperty()
    @Column({
        name: 'api_key_secret',
        type: 'varchar',
        length: 100,
    })
    @MaxLength(100, {
        message: 'API Key Secret is too long',
    })
    public apiKeySecret: string;

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
        name: 'is_active',
        type: 'boolean',
        default: true,
    })
    public isActive: boolean;

    constructor(partial: Partial<Application>) {
        Object.assign(this, partial);
    }

    public getId(): number {
        return this.id;
    }

    @BeforeInsert()
    beforeCreate() {
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.updatedBy = this.createdBy;
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updatedAt = new Date();
    }

}
