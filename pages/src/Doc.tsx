import react from 'react';
import { IType } from './documentation';

import styles from './Doc.module.css';

const Doc: react.FC<{ doc: IType }> = ({ doc }) => (
  <div>
    <h1>{doc.name}</h1>
    <p>{doc.description}</p>
    <h2 className={styles.Methods}>Methods</h2>
    <div>
      {doc.methods.map((method) => (
        <div>
          <code id={method.name}>
            .{method.name}({method.params.map((param) => param.name).join(', ')}
            )
          </code>
          <div className={styles.MethodDef}>
            <p>{method.description}</p>
            {method.params.length > 0 && (
              <div className={styles.ParamsWrapper}>
                <table className={styles.Params}>
                  <tr>
                    <th>Option</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                  {method.params.map((param, i) => (
                    <tr
                      style={{
                        backgroundColor: `var(--dark-${((i + 1) % 2) + 1})`,
                      }}
                    >
                      <td>{param.name}</td>
                      <td>{param.type}</td>
                      <td>{param.required ? 'Yes' : 'No'}</td>
                      <td>{param.default ? param.default : '-'}</td>
                      <td>{param.description}</td>
                    </tr>
                  ))}
                </table>
              </div>
            )}
            <div className={styles.Returns}>
              <p>Returns</p>
              {method.returns}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Doc;
