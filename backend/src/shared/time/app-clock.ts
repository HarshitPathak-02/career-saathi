class AppClock {

    private testDate:
        Date | null = null;


    now(): Date {

        if (this.testDate) {

            return new Date(
                this.testDate
            );

        }


        const environmentDate =
            this.getEnvironmentTestDate();


        if (environmentDate) {

            return environmentDate;

        }


        return new Date();

    }


    setTestDate(
        date: Date
    ): void {

        this.ensureTestingAllowed();


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            throw new Error(
                "Invalid test date."
            );

        }


        this.testDate =
            new Date(
                date
            );

    }


    resetTestDate(): void {

        this.ensureTestingAllowed();

        this.testDate =
            null;

    }


    isUsingTestDate(): boolean {

        return (
            this.testDate !== null ||
            this.getEnvironmentTestDate() !== null
        );

    }


    private getEnvironmentTestDate():
        Date | null {

        /*
         * Never allow environment-based
         * clock manipulation in production.
         */

        if (
            process.env.NODE_ENV ===
            "production"
        ) {

            return null;

        }


        const value =
            process.env.TEST_APP_DATE;


        if (!value) {

            return null;

        }


        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            throw new Error(
                "TEST_APP_DATE contains an invalid date."
            );

        }


        return date;

    }


    private ensureTestingAllowed(): void {

        if (
            process.env.NODE_ENV ===
            "production"
        ) {

            throw new Error(
                "Application clock cannot be modified in production."
            );

        }

    }

}


export const appClock =
    new AppClock();