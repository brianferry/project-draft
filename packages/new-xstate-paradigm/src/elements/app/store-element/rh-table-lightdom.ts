import { css } from "lit";

// @ts-ignore
export const styles = css`
rh-table {
  container: host / inline-size;

  & thead {
    & th {
      position: relative;
      padding-block: var(--rh-space-lg, 16px);
      text-align: start;
      font-weight: var(--rh-font-weight-heading-bold, 700);
    }
  }

  & table {
    min-width: 100%;
    margin: 0 auto;
    table-layout: fixed;
    border: 0;
    border-collapse: collapse;
  }

  & :is(tr, col) {
    transition: background 0.3s ease-out;
  }

  & :is(th, td) {
    padding-inline: var(--rh-space-lg, 16px);
  }

  & :is(col.active) {
    background: var(--_column-background-hover-color);
  }

  & tr {
    border-block-end: var(--_row-border);

    &:hover {
      background: var(--_row-background-hover-color);
    }

    & > * {
      border: none;
    }
  }

  & td {
    padding-block: var(--rh-space-xl, 24px);
  }

  & a {
    color: var(--rh-color-interactive-primary-default);
    text-decoration: none;

    &:hover {
      color: var(--rh-color-interactive-primary-hover);
      text-decoration: underline;
    }
  }

  & caption {
    font-family: var(--rh-font-family-body-text, RedHatText, 'Red Hat Text', 'Noto Sans Arabic', 'Noto Sans Hebrew', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans Malayalam', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans Thai', Helvetica, Arial, sans-serif);
    font-size: var(--rh-font-size-body-text-lg, 1.125rem);
    font-weight: var(--rh-font-weight-heading-bold, 700);
    line-height: var(--rh-line-height-body-text, 1.5);
    margin-block-end: var(--rh-space-xl, 24px);
    text-align: center;
    font-style: normal;
  }
}

@container host (max-width: 768px) {
  table {
    display: grid;

    & *:not(thead) + tbody {
      & tr {
        display: grid;
        grid-auto-columns: auto;
        grid-auto-flow: column;
      }
    }

    & thead {
      display: none;
      visibility: hidden;

      & ~ tbody {
        display: block;

        & tr {
          border: none;
          display: grid;
          grid-template-columns: 1fr;
          height: auto;
          grid-auto-columns: max-content;
          grid-auto-flow: unset;

          &:first-child {
            border-block-start: var(--_row-border);

            & td:first-child {
              padding-block-start: var(--rh-space-lg, 16px);
            }

            & td:last-child {
              padding-block-end: var(--rh-space-lg, 16px);
            }
          }

          &:nth-child(even) {
            background: var(--_row-background-hover-color);
          }

          &:last-child {
            border-block-end: var(--_row-border);
          }

          &:hover {
            background: var(---_column-background-hover-color);
          }

          & > * {
            padding: var(--rh-space-lg, 16px);
          }

          & :is(th, td) {
            padding-block: calc(var(--rh-space-md, 8px) + var(--rh-space-xs, 4px));
            display: grid;
            grid-column-gap: var(--rh-space-lg, 16px);
            grid-template-columns: 1fr minmax(0, 1.5fr);
            align-items: start;
            white-space: normal;
            word-wrap: break-word;
            text-align: start;
          }

          & :is(td,th):before {
            font-weight: var(--rh-font-weight-heading-bold, 700);
            text-align: start;
            content: attr(data-label);
            display: inline-block;
          }

          & th {
            text-align: center;
          }
        }
      }
    }
  }
}`;