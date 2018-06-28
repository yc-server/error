import { IContext } from '@ycs/interfaces';
import * as boom from 'boom';
import * as colors from 'colors/safe';
import * as moment from 'moment';

/**
 * 422 bad data errors
 */
const BadDataErrors = ['CastError', 'ValidationError', 'SyntaxError'];

/**
 * Generating error output
 * @param ctx {IContext} Ycs context
 * @param error {any} Error object ob Boom object
 * @param statusCode {number} error status code
 */
export function handleError(
  ctx: IContext,
  error: any,
  statusCode: number = 500
): void {
  let be;
  if (error.isBoom) {
    be = error;
  } else if (BadDataErrors.includes(error.name)) {
    be = boom.boomify(error, {
      statusCode: 422,
    });

    const errors = (<any>error).errors;
    if (errors) be.output.payload.attributes = errors;
  } else {
    be = boom.boomify(error, {
      statusCode,
    });
  }
  if (be.output.statusCode >= 500) {
    console.log(`[${colors.red(moment().format('YY-MM-DD HH:mm:ss'))}]`);
    console.log(colors.red(JSON.stringify(be.output.payload, null, 2)));
    console.error(error);
  } else {
    console.log(`[${colors.yellow(moment().format('YY-MM-DD HH:mm:ss'))}]`);
    console.log(colors.yellow(JSON.stringify(be.output.payload, null, 2)));
  }
  ctx.status = be.output.statusCode;
  ctx.body = be.output.payload;
}

/**
 * ref to boom
 */
export const Boom = boom;
