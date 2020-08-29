import {
    Component,
    ChangeDetectionStrategy,
    Input,
    ViewChild,
    ElementRef,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import { Leaf, Connector } from 'app/interfaces';
import { WindowService } from 'app/services/window/window.service';
import { LeafOptionsService } from 'app/services/leaf-options/leaf-options.service';

@Component({
    selector: 'leaf',
    templateUrl: './leaf.component.html',
    styleUrls: ['./leaf.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeafComponent implements AfterViewInit {
    @Input() leaf: Leaf;
    @Input() isParentHovered: boolean;

    @ViewChild('matCardRef', {static: false, read: ElementRef})
    matCardRef: ElementRef<HTMLElement>;

    @ViewChild('firstChildLeafRef', {static: false, read: ElementRef})
    firstChildLeafRef: ElementRef<HTMLElement>;

    @ViewChild('secondChildLeafRef', {static: false, read: ElementRef})
    secondChildLeafRef: ElementRef<HTMLElement>;

    @ViewChild('childrenRef', {static: false, read: ElementRef})
    childrenRef: ElementRef<HTMLElement>;

    firstConnector: Connector;
    secondConnector: Connector;
    areConnectorsVisible = false;
    isHovered = false;

    private window: Window;

    constructor(windowService: WindowService,
                private changeDetectorRef: ChangeDetectorRef,
                private leafRef: ElementRef,
                private leafOptionsService: LeafOptionsService) {
        this.window = windowService.getNativeWindow();
    }

    ngAfterViewInit() {
        setTimeout(() => this.calculateConnectorProps());
    }

    onMatCardMouseEnter() {
        this.isHovered = true;
    }

    onMatCardMouseLeave() {
        this.isHovered = false;
    }

    onMatCardClick(leaf: Leaf) {
        this.leafOptionsService.openLeafOptions(leaf);
    }

    private calculateConnectorProps() {
        if (!this.leaf.firstChild) {
            return;
        }

        const connectorsBetweenOffset = 3;
        const firstConnectorLeft = -5;
        const secondConnectorLeft = -15;

        const [
            leafNativeElement,
            matCardNativeElement,
            firstChildLeafNativeElement,
            secondChildLeafNativeElement,
            childrenNativeElement
        ] = [
            this.leafRef,
            this.matCardRef,
            this.firstChildLeafRef,
            this.secondChildLeafRef,
            this.childrenRef
        ].map(({nativeElement}: ElementRef<HTMLElement>) => nativeElement);

        const matCardOffsetTop = this.getComputedProperty(matCardNativeElement, 'margin-top');
        const matCardOffsetLeft = this.getComputedProperty(matCardNativeElement, 'margin-left');
        const childrenOffsetLeft = this.getComputedProperty(childrenNativeElement, 'padding-left');

        const matCardHeight = matCardNativeElement.clientHeight;

        const [
            leafTop,
            firstChildLeafTop,
            secondChildLeafTop
        ] = [
            leafNativeElement,
            firstChildLeafNativeElement,
            secondChildLeafNativeElement
        ].map(element => element.getBoundingClientRect().top);

        let firstConnectorTop: number;
        let secondConnectorTop: number;

        if (!this.leaf.parent) {
            firstConnectorTop = matCardOffsetTop + Math.floor(matCardHeight / 2) + connectorsBetweenOffset;
            secondConnectorTop = matCardOffsetTop + Math.floor(matCardHeight / 2) - connectorsBetweenOffset;
        } else {
            firstConnectorTop = matCardOffsetTop + Math.floor(matCardHeight / 2) + connectorsBetweenOffset * 2;
            secondConnectorTop = matCardOffsetTop + Math.floor(matCardHeight / 2);
        }

        let firstConnectorVerticalPathHeight = firstChildLeafTop
            - leafTop
            - firstConnectorTop
            + matCardOffsetTop
            + Math.floor(matCardHeight / 2);

        if (this.leaf.firstChild.firstChild) {
            firstConnectorVerticalPathHeight -= connectorsBetweenOffset * 2;
        }

        let secondConnectorVerticalPathHeight = secondChildLeafTop
            - leafTop
            - secondConnectorTop
            + matCardOffsetTop
            + Math.floor(matCardHeight / 2);

        if (this.leaf.secondChild.firstChild) {
            secondConnectorVerticalPathHeight -= connectorsBetweenOffset * 2;
        }

        this.firstConnector = {
            width: childrenOffsetLeft - firstConnectorLeft + matCardOffsetLeft,
            height: firstConnectorVerticalPathHeight + firstConnectorTop,
            left: firstConnectorLeft,
            path: `M${-firstConnectorLeft + matCardOffsetLeft} ${firstConnectorTop}`
                + ` h ${firstConnectorLeft}`
                + ` v ${firstConnectorVerticalPathHeight}`
                + ` h ${childrenOffsetLeft - firstConnectorLeft + matCardOffsetLeft}`
        }

        this.secondConnector = {
            width: childrenOffsetLeft - secondConnectorLeft + matCardOffsetLeft,
            height: secondConnectorVerticalPathHeight + secondConnectorTop,
            left: secondConnectorLeft,
            path: `M${-secondConnectorLeft + matCardOffsetLeft} ${secondConnectorTop}`
                + ` h ${secondConnectorLeft}`
                + ` v ${secondConnectorVerticalPathHeight}`
                + ` h ${childrenOffsetLeft - secondConnectorLeft + matCardOffsetLeft}`
        }

        this.areConnectorsVisible = true;
        this.changeDetectorRef.markForCheck();
    }

    private getComputedProperty(element: HTMLElement, propertyName: string): number {
        return parseInt(this.window.getComputedStyle(element)[propertyName], 10);
    }
}
