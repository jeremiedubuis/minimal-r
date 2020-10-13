import React from 'react';
import { Router } from './Router';

type LinkProps = {
    activeClassName?: string;
    className?: string;
    external?: boolean;
    href: string;
};

export class Link extends React.Component<LinkProps> {
    render() {
        const { activeClassName, className, external, children, href, ...rest } = this.props;
        return (
            <a href={href} {...rest} onClick={this.onClick} className={this.getClassName()}>
                {children}
            </a>
        );
    }

    onClick = (e: React.MouseEvent): void => {
        if (!this.props.external) {
            e.preventDefault();
            Router.goto(this.props.href);
        }
    };

    getClassName() {
        if (this.props.activeClassName && this.isActive()) {
            return (
                ((this.props.className && `${this.props.className} `) || '') +
                this.props.activeClassName
            );
        }
        return this.props.className;
    }

    isActive = (): boolean => {
        const match = Router.getMatch();
        if (!this.props.href || !match) return false;
        return this.props.href === match.currentPath;
    };
}
